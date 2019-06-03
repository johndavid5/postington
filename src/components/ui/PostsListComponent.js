import PropTypes from 'prop-types'
import { Component } from 'react'

// `withRouter` is an HOC.  When we export the 
// component, we send it to `withRouter` which wraps
// it with a component that passes the router properties:
// match, history, and location (as props)...
import { withRouter } from 'react-router'

/* query-string: parse() query string into an object */
/*               stringify() object into query string */
/* reference: https://www.npmjs.com/package/query-string */
import queryString from 'query-string'

import SortButton from './SortButton'

import { logajohn } from '../../lib/logajohn'

import { customStringify, strEqualsIgnoreCase, stringToBool } from '../../lib/utils' // Safer than JSON.stringify()... 

// import '../../stylesheets/PostsListComponent.scss'
import '../../../stylesheets/PostsListComponent.scss'

// const PostsListComponent = ({ linksQa={}, debug=true}) => {
// const PostsListComponent = (props) => {
class PostsListComponent extends Component {

    
    constructor(props){
        super(props)

        let sWho = `PostsListComponent::constructor`
        logajohn.debug(`${sWho}(): this.props=`, customStringify(this.props, ' '))

        this.state = {
            postIsEditingPost: props.posts.post_is_editing_post ? props.posts.post_is_editing_post : {},
            postIsEditingId: props.posts.post_is_editing_id ? props.posts.post_is_editing_id: -1,
        }

        this.sortBy = this.sortBy.bind(this)
        this.editStart = this.editStart.bind(this)

        this.handleTitleEditChange = this.handleTitleEditChange.bind(this);
        this.handleTitleEditSubmit = this.handleTitleEditSubmit.bind(this);
        this.handleTitleEditCancel = this.handleTitleEditCancel.bind(this);
    } 

    handleTitleEditChange(event) {

        let sWho = "PostsListComponent::handleTitleEditChange"

	    const target = event.target;
        //logajohn.debug(`${sWho}(): target = `, customStringify(target) )

	    const newTitleValue = target.value;
        //logajohn.debug(`${sWho}(): value = `, customStringify(value) )
        //logajohn.debug(`${sWho}(): this.props.posts = `, this.props.posts )

        this.setState( (state, props)=>{
            let stateChanger = {   
                postIsEditingPost: { ...state.postIsEditingPost, title: newTitleValue }
            }
            return stateChanger
        })

        //let { onPostEditChange }  = this.props
	    //onPostEditChange( this.props.posts.post_is_editing_id, postEdited ) 

    }/* handleTitleEditChange() */

    handleTitleEditCancel(event) {

        let sWho = "PostsListComponent::handleTitleEditCancel"

        if( event ){
            event.preventDefault()
            event.stopPropagation()
        }

        let { onPostEditCancel }  = this.props
	    onPostEditCancel( this.props.posts.post_is_editing_id )
    }

    handleTitleEditSubmit(event) {

        let sWho = "PostsListComponent::handleTitleEditSubmit"

        if( event ){
            event.preventDefault()
            event.stopPropagation()
        }

        let { onPostEditFinish }  = this.props

	    onPostEditFinish( this.props.posts.post_is_editing_id,  this.state.postIsEditingPost )

        //this.filterIt() -- re-filter...or is this overkill...?
    }

    /* Dispatch edit action to begin editing a post... */
    editStart(post_id){
        let sWho = 'PostsListComponent::editStart';
        logajohn.debug(`${sWho}(): post_id=`, post_id )
        const { onPostEditStart } = this.props; // Get dispatch method from props...via the magic of connect() in containers.js... 
        onPostEditStart( post_id ) 
    }

    /* State derived from props -- Oh my!...but only when we begin editing a post... */
    componentDidUpdate(prevProps, prevState) {

        let sWho = "PostsListComponent::componentDidUpdate"

        if( this.props.componentDidUpdateSpy ){
            // You can use this intrusive spy to check on calls to componentDidUpdate, and also to ascertain state...
            this.props.componentDidUpdateSpy({'prevProps': {...prevProps}, 'currProps': {...this.props}, 'prevState': {...prevState}, 'currState': {...this.state}})
        }

        // Don't forget to compare props...!
        if (this.props.posts.post_is_editing_id !== prevProps.posts.post_is_editing_id 
                ||
            this.props.posts.post_is_editing !== prevProps.posts.post_is_editing 
        ){
            this.setState((state,props)=>{

                let returno = {
                        postIsEditingPost: props.posts.post_is_editing_post ? props.posts.post_is_editing_post : {},
                        postIsEditingId: props.posts.post_is_editing_id ? props.posts.post_is_editing_id: -1
                }

                logajohn.debug(`${sWho}(): Returning returno = `, returno )

                return returno
            })
        }
    }/* componentDidUpdate() */

    sortBy(event, sWhat, sAscDesc){

        let sWho = 'PostsListComponent::sortby';

        //logajohn.debug(`${sWho}(): event = `, customStringify(event) )
        //logajohn.debug(`${sWho}(): event.target = `, customStringify(event.target) )
        //logajohn.debug(`${sWho}(): this.props = `, customStringify(this.props) )
        logajohn.debug(`${sWho}(): sWhat = '${sWhat}', sAscDesc = '${sAscDesc}'...`)

        const { onPostsFilter } = this.props; // Get dispatch method from props...via the magic of connect() in containers.js... 
        const currentFilters = ( this.props.posts && this.props.posts.posts_filters ) ? this.props.posts.posts_filters : {}

        logajohn.debug(`${sWho}(): currentFilters = `, currentFilters )

        // Important: Use spread operator ... to preserve current filters...
        let filters = { ...currentFilters, sort_by_field: sWhat, sort_by_asc_desc: sAscDesc };

        event.preventDefault()

        logajohn.debug(`${sWho}(): Calling onPostsFilter(filters=`, customStringify(filters), `...`);
        
        onPostsFilter(filters);

    }/* sortBy() */

    render(){ 

        let sWho = "PostsListComponent::render"

        const posts = this.props.posts

        let debug = false

        // Bulletproofing in case we don't have this.props.location...
        if(this.props.hasOwnProperty('location') && this.props.location.hasOwnProperty('search')){
            // Make this.props.location.search query string into an object...
            let search_object = queryString.parse(this.props.location.search)
            logajohn.debug(`${sWho}(): search_object = `, search_object )

            //debug = stringToBool( search_object.debug )
        }
		logajohn.debug(`${sWho}(): debug = `, debug )

        //logajohn.debug(`${sWho}(): this.props = `, this.props)

        //logajohn.debug(`${sWho}(): posts = `, posts)

        //logajohn.debug(`${sWho}(): posts.posts_list = `, posts.posts_list)

        //logajohn.debug(`${sWho}(): typeof(posts.posts_list) = '${typeof(posts.posts_list)}'...` )


    const thStyle = {
	  border: '2px solid #DCDCDC',
      color: 'white',
      backgroundColor: '#C1B9DB',
	  padding: '2px',
      textAlign: 'center',
    }

    const tdStyle = {
	  border: '2px solid #DCDCDC',
	  padding: '2px',
      textAlign: 'left',
      cursor: 'pointer'
    }

    const gefilterStyle = {
        color: 'blue',
        whiteSpace: 'nowrap',
        fontSize: '115%'
    }

    const timestampStyle = {
        color: 'purple',
        whiteSpace: 'nowrap',
        fontSize: '115%'
    }

    let gefilters = []

    // Add filter information here if you wish the filter info to be displayed as a pretty text string...
    let gefilterees = [ 
        { field: 'user_id_filter', pretty_field: 'User ID Filter' }
        ,{ field: 'title_filter', pretty_field: 'Title Filter' }
        ,{ field: 'body_filter', pretty_field: 'Body Filter' }
    ]

    // Form a string list of the filters for the benefit of the end-user...
    gefilterees.forEach( (val)=>{
        if( posts && posts.posts_filters && posts.posts_filters[val.field] ){

            let sluggified_field = val.field.replace(/_/g, '-') // e.g., 'description-field'

            let id=`static-${sluggified_field}`; // e.g., 'static-title-filter' 

            if( gefilters.length > 0 ){
                gefilters.push(<span style={gefilterStyle}>, and </span>)
            }
            else{
                gefilters.push(<span style={gefilterStyle}>...with...</span>)
            }

            gefilters.push(<span style={gefilterStyle}>{val.pretty_field}=&quot;<span id={id}>{posts.posts_filters[val.field]}</span>&quot;</span>);
        }
    })

    if(gefilters.length == 0){
        gefilters.push(<span style={gefilterStyle}>...with no filters...</span>)
    }


    let gears = ""
    if( posts && posts.hasOwnProperty("posts_fetching") && posts.posts_fetching == true ){
        gears = <img id="spinning-gears" src="/postington/images/gold-brass-gear-cogs-animated-5.gif" width="100" alt="Fetching...stand by..."
        style={{position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto'
        }} />
    }

    let sCurrentSortByField = ""
    if( posts && posts.posts_filters && posts.posts_filters.sort_by_field ){
       sCurrentSortByField =  posts.posts_filters.sort_by_field
    }

    let sCurrentSortByAscDesc = ""
    if( posts && posts.posts_filters && posts.posts_filters.sort_by_asc_desc){
       sCurrentSortByAscDesc =  posts.posts_filters.sort_by_asc_desc
    }

    let i_num_posts = (posts && typeof(posts.posts_list) !== 'undefined' && typeof(posts.posts_list.length) !== 'undefined') ? posts.posts_list.length : 0

    let s_num_posts = ""
    if( i_num_posts == 0 ){
        if( posts.posts_list ){
          s_num_posts = "No "    
        }
    }
    else{
          s_num_posts = "" + i_num_posts + " "
    }

    let posts_table = (  (i_num_posts > 0) ?
        (
                  <table className="table" id="posts-table" style={{marginTop: '10px'}}>
                        <thead>
                      <tr>
                          <th scope="col" style={{...thStyle, width: '5%'}}>{1==1?<SortButton sWhat='user_id' sWhatPretty='User ID' sCurrentSortBy={sCurrentSortByField} sCurrentAscDesc={sCurrentSortByAscDesc} onSortBy={this.sortBy} />:""}</th>
                          <th scope="col" style={{...thStyle, width: '28%'}}>{1==1?<SortButton sWhat='title' sWhatPretty='Title' sCurrentSortBy={sCurrentSortByField} sCurrentAscDesc={sCurrentSortByAscDesc} onSortBy={this.sortBy} />:""}</th>
                          <th scope="col" style={{...thStyle, width: '66%'}}>{1==1?<SortButton sWhat='body' sWhatPretty='Body' sCurrentSortBy={sCurrentSortByField} sCurrentAscDesc={sCurrentSortByAscDesc} onSortBy={this.sortBy} />:""}</th>
                      </tr>
                    </thead>
                        <tbody>
                      {
                                posts.posts_list.map((post, index) => (
                                  <tr id={'post-'+post.id} key={post.id} className={posts.post_is_editing && post.id == posts.post_is_editing_id ? "selected" : ""} onClick={()=>{this.editStart(post.id)}}>
                                      <td style={{...tdStyle, textAlign: 'center', width: '10%'}} id ={'user-id-' + post.id} key={'user-id-' + post.id}>{post.userId}</td>
                                      <td style={{...tdStyle, width: '23%'}} id ={'title-' + post.id} key={'title-' + post.id}>
                                      {
                                       this.props.posts.post_is_editing && (this.props.posts.post_is_editing_id == post.id) ? (
                                       <form id={'post-edit-title-form-' + post.id} className="post-edit-title-form form-vertical" onSubmit={this.handleTitleEditSubmit}>
                                        <input type="text" className="form-control" id={'title-edit-'+post.id} name="titleEdit"
                                         aria-label="Title Edit" size="40" value={this.state.postIsEditingPost.title}
                                         onChange={this.handleTitleEditChange} />
                                         <button type="button" id={'title-edit-ok-button-'+post.id} class="btn btn-success btn-sm" onClick={this.handleTitleEditSubmit}>OK</button><button type="button" id={'title-edit-cancel-button-'+post.id} class="btn btn-default btn-sm" onClick={this.handleTitleEditCancel}>Cancel</button>
                                       </form> )
                                       :
                                       post.title
                                      }
                                      </td>
                                      <td style={{...tdStyle, width: '66%'}} id={'body-' + post.id} key={'body-' + post.id}><pre style={{backgroundColor: 'inherit'}}>{post.body}</pre></td>
                                    </tr>
                                ))
                      }
                    </tbody>
                    </table>
                ) : ""

    )

    return (
      <div className="posts-list-component container-fluid" style={{ paddingLeft: '1em' }}>
      <div className="filter-param row">
        <div className="col-sm-4">
          {posts && posts.posts_timestamp ? <p id="posts-timestamp" style={timestampStyle}>{posts.posts_timestamp}</p> : ""}
        </div>
        <div className="col-sm-4">
          <h4 style={{color: 'purple', textAlign: 'center', margin: '0px'}}>{s_num_posts}Post{i_num_posts == 1 ? "": "s"}, Sir...</h4>
        </div>
        <div className="col-sm-4">
          <h4 style={{color: 'purple', textAlign: 'center', margin: '0px'}}>Click Post to edit, Sir...</h4>
        </div>
      </div>
      <div>
      {gefilters}
      </div>
      {gears}
      {posts_table}
      { ((debugee)=>{
          if(debugee == true)
            return (
                <div>
                    <pre style={{ fontSize: '125%', textAlign: 'left' }}>
                    this.props = { JSON.stringify(this.props, null, ' ') }
                    </pre>
                </div>
            )
          else
            return ''
  	      })( debug ) // IIFE
       }
       </div>
       )
  }/* render() */

}/* class PostsListComponent extends Component */

PostsListComponent.propTypes = {
    posts: PropTypes.object,
    debug: PropTypes.bool,
}

export default withRouter(PostsListComponent)
