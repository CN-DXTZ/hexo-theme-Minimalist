lists: (function( ) {
    // Use a closure to hide a few variables.
    var any_list = "[*+-]|\\d+\\.",
        bullet_list = /[*+-]/,
        number_list = /\d+\./,
        // Capture leading indent as it matters for determining nested lists.
        is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
        indent_re = "(?: {0,3}\\t| {4})";

    // TODO: Cache this regexp for certain depths.
    // Create a regexp suitable for matching an li for a given stack depth
    function regex_for_depth( depth ) {

      return new RegExp(
        // m[1] = indent, m[2] = list_type
        "(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
        // m[3] = cont
        "(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
      );
    }
    function expand_tab( input ) {
      return input.replace( / {0,3}\t/g, "    " );
    }

    // Add inline content `inline` to `li`. inline comes from processInline
    // so is an array of content
    function add(li, loose, inline, nl) {
      if ( loose ) {
        li.push( [ "para" ].concat(inline) );
        return;
      }
      // Hmmm, should this be any block level element or just paras?
      var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] == "para"
                 ? li[li.length -1]
                 : li;

      // If there is already some content in this list, add the new line in
      if ( nl && li.length > 1 ) inline.unshift(nl);

      for ( var i = 0; i < inline.length; i++ ) {
        var what = inline[i],
            is_str = typeof what == "string";
        if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] == "string" ) {
          add_to[ add_to.length-1 ] += what;
        }
        else {
          add_to.push( what );
        }
      }
    }

    // contained means have an indent greater than the current one. On
    // *every* line in the block
    function get_contained_blocks( depth, blocks ) {

      var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
          replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
          ret = [];

      while ( blocks.length > 0 ) {
        if ( re.exec( blocks[0] ) ) {
          var b = blocks.shift(),
              // Now remove that indent
              x = b.replace( replace, "");

          ret.push( mk_block( x, b.trailing, b.lineNumber ) );
        }
        else {
          break;
        }
      }
      return ret;
    }

    // passed to stack.forEach to turn list items up the stack into paras
    function paragraphify(s, i, stack) {
      var list = s.list;
      var last_li = list[list.length-1];

      if ( last_li[1] instanceof Array && last_li[1][0] == "para" ) {
        return;
      }
      if ( i + 1 == stack.length ) {
        // Last stack frame
        // Keep the same array, but replace the contents
        last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ) );
      }
      else {
        var sublist = last_li.pop();
        last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
      }
    }

    // The matcher function
    return function( block, next ) {
      var m = block.match( is_list_re );
      if ( !m ) return undefined;

      function make_list( m ) {
        var list = bullet_list.exec( m[2] )
                 ? ["bulletlist"]
                 : ["numberlist"];

        stack.push( { list: list, indent: m[1] } );
        return list;
      }


      var stack = [], // Stack of lists for nesting.
          list = make_list( m ),
          last_li,
          loose = false,
          ret = [ stack[0].list ],
          i;

      // Loop to search over block looking for inner block elements and loose lists
      loose_search:
      while ( true ) {
        // Split into lines preserving new lines at end of line
        var lines = block.split( /(?=\n)/ );

        // We have to grab all lines for a li and call processInline on them
        // once as there are some inline things that can span lines.
        var li_accumulate = "";

        // Loop over the lines in this block looking for tight lists.
        tight_search:
        for ( var line_no = 0; line_no < lines.length; line_no++ ) {
          var nl = "",
              l = lines[line_no].replace(/^\n/, function(n) { nl = n; return ""; });

          // TODO: really should cache this
          var line_re = regex_for_depth( stack.length );

          m = l.match( line_re );
          //print( "line:", uneval(l), "\nline match:", uneval(m) );

          // We have a list item
          if ( m[1] !== undefined ) {
            // Process the previous list item, if any
            if ( li_accumulate.length ) {
              add( last_li, loose, this.processInline( li_accumulate ), nl );
              // Loose mode will have been dealt with. Reset it
              loose = false;
              li_accumulate = "";
            }

            m[1] = expand_tab( m[1] );
            var wanted_depth = Math.floor(m[1].length/4)+1;
            //print( "want:", wanted_depth, "stack:", stack.length);
            if ( wanted_depth > stack.length ) {
              // Deep enough for a nested list outright
              //print ( "new nested list" );
              list = make_list( m );
              last_li.push( list );
              last_li = list[1] = [ "listitem" ];
            }
            else {
              // We aren't deep enough to be strictly a new level. This is
              // where Md.pl goes nuts. If the indent matches a level in the
              // stack, put it there, else put it one deeper then the
              // wanted_depth deserves.
              var found = false;
              for ( i = 0; i < stack.length; i++ ) {
                if ( stack[ i ].indent != m[1] ) continue;
                list = stack[ i ].list;
                stack.splice( i+1, stack.length - (i+1) );
                found = true;
                break;
              }

              if (!found) {
                //print("not found. l:", uneval(l));
                wanted_depth++;
                if ( wanted_depth <= stack.length ) {
                  stack.splice(wanted_depth, stack.length - wanted_depth);
                  //print("Desired depth now", wanted_depth, "stack:", stack.length);
                  list = stack[wanted_depth-1].list;
                  //print("list:", uneval(list) );
                }
                else {
                  //print ("made new stack for messy indent");
                  list = make_list(m);
                  last_li.push(list);
                }
              }

              //print( uneval(list), "last", list === stack[stack.length-1].list );
              last_li = [ "listitem" ];
              list.push(last_li);
            } // end depth of shenegains
            nl = "";
          }

          // Add content
          if ( l.length > m[0].length ) {
            li_accumulate += nl + l.substr( m[0].length );
          }
        } // tight_search

        if ( li_accumulate.length ) {
          add( last_li, loose, this.processInline( li_accumulate ), nl );
          // Loose mode will have been dealt with. Reset it
          loose = false;
          li_accumulate = "";
        }

        // Look at the next block - we might have a loose list. Or an extra
        // paragraph for the current li
        var contained = get_contained_blocks( stack.length, next );

        // Deal with code blocks or properly nested lists
        if ( contained.length > 0 ) {
          // Make sure all listitems up the stack are paragraphs
          forEach( stack, paragraphify, this);

          last_li.push.apply( last_li, this.toTree( contained, [] ) );
        }

        var next_block = next[0] && next[0].valueOf() || "";

        if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
          block = next.shift();

          // Check for an HR following a list: features/lists/hr_abutting
          var hr = this.dialect.block.horizRule( block, next );

          if ( hr ) {
            ret.push.apply(ret, hr);
            break;
          }

          // Make sure all listitems up the stack are paragraphs
          forEach( stack, paragraphify, this);

          loose = true;
          continue loose_search;
        }
        break;
      } // loose_search

      return ret;
    };
  })(),

  blockquote: function blockquote( block, next ) {
    if ( !block.match( /^>/m ) )
      return undefined;

    var jsonml = [];

    // separate out the leading abutting block, if any. I.e. in this case:
    //
    //  a
    //  > b
    //
    if ( block[ 0 ] != ">" ) {
      var lines = block.split( /\n/ ),
          prev = [],
          line_no = block.lineNumber;

      // keep shifting lines until you find a crotchet
      while ( lines.length && lines[ 0 ][ 0 ] != ">" ) {
          prev.push( lines.shift() );
          line_no++;
      }

      var abutting = mk_block( prev.join( "\n" ), "\n", block.lineNumber );
      jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
      // reassemble new block of just block quotes!
      block = mk_block( lines.join( "\n" ), block.trailing, line_no );
    }


    // if the next block is also a blockquote merge it in
    while ( next.length && next[ 0 ][ 0 ] == ">" ) {
      var b = next.shift();
      block = mk_block( block + block.trailing + b, b.trailing, block.lineNumber );
    }

    // Strip off the leading "> " and re-process as a block.
    var input = block.replace( /^> ?/gm, "" ),
        old_tree = this.tree,
        processedBlock = this.toTree( input, [ "blockquote" ] ),
        attr = extract_attr( processedBlock );

    // If any link references were found get rid of them
    if ( attr && attr.references ) {
      delete attr.references;
      // And then remove the attribute object if it's empty
      if ( isEmpty( attr ) ) {
        processedBlock.splice( 1, 1 );
      }
    }

    jsonml.push( processedBlock );
    return jsonml;
  },

  referenceDefn: function referenceDefn( block, next) {
    var re = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
    // interesting matches are [ , ref_id, url, , title, title ]

    if ( !block.match(re) )
      return undefined;

    // make an attribute node if it doesn't exist
    if ( !extract_attr( this.tree ) ) {
      this.tree.splice( 1, 0, {} );
    }

    var attrs = extract_attr( this.tree );

    // make a references hash if it doesn't exist
    if ( attrs.references === undefined ) {
      attrs.references = {};
    }

    var b = this.loop_re_over_block(re, block, function( m ) {

      if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
        m[2] = m[2].substring( 1, m[2].length - 1 );

      var ref = attrs.references[ m[1].toLowerCase() ] = {
        href: m[2]
      };

      if ( m[4] !== undefined )
        ref.title = m[4];
      else if ( m[5] !== undefined )
        ref.title = m[5];

    } );

    if ( b.length )
      next.unshift( mk_block( b, block.trailing ) );

    return [];
  },

  para: function para( block, next ) {
    // everything's a para!
    return [ ["para"].concat( this.processInline( block ) ) ];
  }
}