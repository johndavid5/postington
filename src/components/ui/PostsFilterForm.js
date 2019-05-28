import { Component } from 'react'
// `withRouter` is an HOC.  When we export the 
// component, we send it to `withRouter` which wraps
// it with a component that passes the router properties:
// match, history, and location (as props)...
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import { config } from '../../config'
import { logajohn } from '../../lib/logajohn' 

import { customStringify } from '../../lib/utils' // Safer than JSON.stringify()... 

import '../../../stylesheets/PostsFilterForm.scss'

//logajohn.setLevel(config.DEBUG_LEVEL)
//logajohn.setLevel('debug')
//logajohn.debug(`src/components/ui/PostsFilterForm.js: logajohn.getLevel()=${logajohn.getLevel()}...`)
console.log(`src/components/ui/PostsFilterForm.js: config.DEBUG_LEVEL = `, config.DEBUG_LEVEL )
console.log(`src/components/ui/PostsFilterForm.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

class PostsFilterForm extends Component {

    VERSION = "1.1.10"

    // Even though we don't set sortBy stuff in this PostsFilterForm,
    // we do pass along the sort info we get from props...so it seems
    // smoothest to set default sort here in our filterIt() method
    // which automatically carries out the initial fetch...
    // If we wanted to be fancier, we could also "remember"
    // the user's most recent sort by fields via cookies
    // or, better yet the HTML 5 localStorage object... 
    //
    // Use static method to simulate a "const"...
    static DEFAULT_SORT_BY_FIELD(){ return "title"}
    static DEFAULT_SORT_BY_ASC_DESC(){ return "asc"}

    constructor(props){
        super(props)
        let sWho = `PostsFilterForm(${this.VERSION})::constructor`
        logajohn.debug(`${sWho}(): this.props=`, customStringify(this.props, ' '))

        // For testing purposes, 
        //    initialize filters in state with their corresponding props...
        //    or set to ''...which also avoids sending ?title_filter=undefined in the
        //    query string...
        this.state = {
            userIdFilter: props.userIdFilter ? props.userIdFilter: '',
            titleFilter: props.titleFilter ? props.titleFilter: '',
            bodyFilter: props.bodyFilter ? props.bodyFilter: '',
            postIsEditingPost: props.posts && props.posts.post_is_editing_post ? props.posts.post_is_editing_post : {},
            postIsEditingId: props.posts && props.posts.post_is_editing_id ? props.posts.post_is_editing_id: -1,
            titleFilterAutoSuggestArray: [],
            titleFilterAutoSuggestIndex: -1
        }

        logajohn.debug(`${sWho}(): this.state=`, this.state)

        this.submit = this.submit.bind(this)

        this.filterIt = this.filterIt.bind(this)

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTitleFilterChange = this.handleTitleFilterChange.bind(this);
        this.handleTitleFilterAutoSuggestChange =this.handleTitleFilterAutoSuggestChange.bind(this);

        this.autoSuggestUpate =this.autoSuggestUpdate.bind(this);

        this.handleTitleEdit = this.handleTitleEdit.bind(this);
        this.handleTitleEditSubmit = this.handleTitleEditSubmit.bind(this);
        this.handleTitleEditCancel = this.handleTitleEditCancel.bind(this);

        this.autoSuggestGetSuggestions = this.autoSuggestGetSuggestions.bind(this);
    }

    // Yes, I'm using state derived from props for
    // state.postIsEditingPost and state.postIsEditingId derived from props...doing a redux action for
    // each keystroke seems to take too long to update when editing the props...
    componentDidUpdate(prevProps, prevState) {

        if( this.props.componentDidUpdateSpy ){
            // You can use this intrusive spy to check on calls to componentDidUpdate, and also to ascertain state...
            this.props.componentDidUpdateSpy({'prevProps': {...prevProps}, 'currProps': {...this.props}, 'prevState': {...prevState}, 'currState': {...this.state}})
        }

        let sWho = "PostsFilterForm::componentDidUpdate"

        // Don't forget to compare props...!
        if (this.props.posts.post_is_editing_id !== prevProps.posts.post_is_editing_id 
                ||
            this.props.posts.post_is_editing !== prevProps.posts.post_is_editing 
        ){
            this.setState((state,props)=>{

                let sWho = `${sWho}::setState`

                let stateUpdate = {
                        postIsEditingPost: props.posts.post_is_editing_post ? props.posts.post_is_editing_post : {},
                        postIsEditingId: props.posts.post_is_editing_id ? props.posts.post_is_editing_id: -1
                }

                logajohn.debug(`${sWho}(): SHEMP: Moe, props.posts.post_is_editing_id went from ${prevProps.posts.post_is_editing_id} to ${this.props.posts.post_is_editing_id}, and props.posts.post_is_editing went from ${prevProps.posts.post_is_editing} to ${this.props.posts.post_is_editing}...`)

                logajohn.debug(`${sWho}(): SHEMP: Moe, looks like a change in props.posts_is_editing_id or props.post_is_editing, returning stateUpdate = `, stateUpdate )

                return stateUpdate
            })
        }

        // Listen for edit change in posts...
        if( this.props.posts.post_is_editing_iteration !== prevProps.posts.post_is_editing_iteration ){
            logajohn.debug(`${sWho}(): SHEMP: Moe, looks like a change in props.posts_is_editing_iteration, callin' dhis.filterIt() and dhis.autoSuggestUpdate()...`)
            this.filterIt()
            this.autoSuggestUpdate()
        }

    }/* componentDidUpdate() */

    submit(event) {

        let sWho = "PostsFilterForm::submit";

        if(event){
            event.preventDefault()
        }

        this.filterIt(); 
    }

    filterIt(){

        let sWho = "PostsFilterForm::filterIt";

        // Intrusive hack to allow spying on filterIt() by setting this.props.filterItSpy equal to a spy function...
        if(this.props.filterItSpy){
            this.props.filterItSpy(this)
        }

        logajohn.debug(`${sWho}(): this.props = `, customStringify(this.props) )
        logajohn.debug(`${sWho}(): this.state = `, customStringify(this.state) )

        const currentFilters = ( this.props.posts && this.props.posts.posts_filters ) ? this.props.posts.posts_filters : {}

        // Important: Use spread operator ... to preserve current filter fields such as sort_by_field and sort_by_asc_desc 
        let filters = { ...currentFilters,
            user_id_filter: this.state.userIdFilter,
            title_filter: this.state.titleFilter,
            body_filter: this.state.bodyFilter
        };

        if( ! filters.sort_by_field ){
            filters.sort_by_field = PostsFilterForm.DEFAULT_SORT_BY_FIELD(); 
        }
        if( ! filters.sort_by_asc_desc ){
            filters.sort_by_asc_desc = PostsFilterForm.DEFAULT_SORT_BY_ASC_DESC();
        }

        const { onPostsFilter } = this.props; // Get dispatch method from props...

        logajohn.debug(`${sWho}(): Calling onPostsFilter(filters=`, customStringify(filters), `...`);
        
        onPostsFilter(filters);

    }/* filterIt() */

    /* Load filtered posts as soon as the component mounts...as if the user hit the submit button... */
    /* Returns a Promise to allow tests to wait on it... */
    componentDidMount(){
	        let sWho = "PostsFilterForm::componentDidMount";
	        const { onPostsFetch } = this.props; // Get dispatch method from props...
	
	        logajohn.info(`${sWho}(): Calling onPostsFetch(), Moe...`);
	
	        onPostsFetch()
	        .then(()=>{
	            logajohn.info(`${sWho}(): onPostsFetch().then calling this.filterIt(), Moe...`)
	            this.filterIt()
	        })
    }

    // Should update state key to equal new value of corresponding component name... 
    handleInputChange(event) {

        let sWho = "PostsFilterForm::handleInputChange"

	    const target = event.target;
        //logajohn.debug(`${sWho}(): target = `, customStringify(target) )

	    const value = target.type === 'checkbox' ? target.checked : target.value;
        logajohn.debug(`${sWho}(): value = `, customStringify(value) )

	    const name = target.name;
        logajohn.debug(`${sWho}(): name = `, customStringify(name) )
	
        let stateSetter = {
	      [name]: value
	    };

        logajohn.debug(`${sWho}(): stateSetter = `, customStringify(stateSetter) )

	    this.setState( stateSetter, ()=>{
            // overkill?
            // this.filterIt()
        })


    }/* handleInputChange() */

    handleTitleFilterChange(event) {

        let sWho = "PostsFilterForm::handleTitleFilterChange"

	    const target = event.target;

	    const titleFilterValue = target.value;
        logajohn.info(`${sWho}(): titleFilterValue = '${titleFilterValue}'...` )

        this.autoSuggestUpdate(titleFilterValue)

    }/* handleTitleFilterChange() */

    autoSuggestUpdate(titleFilterValue){
        let sWho = "PostsFilterForm::autoSuggestUpdate"

        if(this.props.autoSuggestUpdateSpy){
            this.props.autoSuggestUpdateSpy({"this": this, "args": [titleFilterValue]})
        }

        if( typeof(titleFilterValue) === 'undefined' ){
           titleFilterValue = this.state.titleFilter 
        }

        let autoSuggests = this.autoSuggestGetSuggestions( titleFilterValue, 'title' )

        logajohn.info(`${sWho}(): autoSuggests.length = `, autoSuggests.length )
        logajohn.info(`${sWho}(): autoSuggests = `, autoSuggests )

	    //const name = target.name;
        //logajohn.debug(`${sWho}(): name = `, customStringify(name) )
	
        let stateSetter = {
	      titleFilter: titleFilterValue,
	      titleFilterAutoSuggestArray: autoSuggests
	    };

        logajohn.debug(`${sWho}(): stateSetter = `, customStringify(stateSetter) )

	    this.setState( stateSetter, ()=>{
            // overkill?
            //this.filterIt()
        } 
        )

    }

    handleTitleFilterAutoSuggestChange(event){
        let sWho = "PostsFilterForm::handleTitleFilterAutoSuggestChange"

	    const target = event.target;

	    this.setState( (state, props)=>{

	      const titleFilterAutoSuggestIndex = target.value;
          logajohn.info(`${sWho}(): titleFilterAutoSuggestIndex = '${titleFilterAutoSuggestIndex}'...` )

	      const titleFilterAutoSuggestString = state.titleFilterAutoSuggestArray[titleFilterAutoSuggestIndex]
          logajohn.info(`${sWho}(): titleFilterAutoSuggestString = '${titleFilterAutoSuggestString}'...` )

          let stateSetter = {
	        titleFilter: titleFilterAutoSuggestString,
	        titleFilterAutoSuggestIndex
	      };

          logajohn.debug(`${sWho}(): stateSetter = `, customStringify(stateSetter) )

	      return stateSetter
        }, ()=>{
                // We may as well re-filter...?
                //this.filterIt() 
        })
    }

    handleTitleEdit(event) {

        let sWho = "PostsFilterForm::handleTitleEdit"

	    const target = event.target;
        //logajohn.debug(`${sWho}(): target = `, customStringify(target) )

	    const newTitleValue = target.value;
        //logajohn.debug(`${sWho}(): value = `, customStringify(value) )
        //logajohn.debug(`${sWho}(): this.props.posts = `, this.props.posts )

        //let postEdited = { ...this.state.postIsEditingPost, title: value }
        //let postEdited = { ...this.props.posts.post_is_editing_post, title: value }

        this.setState( (state, props)=>{
            let stateChanger = {   
                postIsEditingPost: { ...state.postIsEditingPost, title: newTitleValue }
            }
            return stateChanger
        })

        //let { onPostEditChange }  = this.props
	    //onPostEditChange( this.props.posts.post_is_editing_id, postEdited ) 

    }/* handleTitleEdit() */

    handleTitleEditCancel(event) {

        let sWho = "PostsFilterForm::handleTitleEditCancel"

        let { onPostEditCancel }  = this.props
	    onPostEditCancel( this.props.posts.post_is_editing_id )

    }

    handleTitleEditSubmit(event) {

        let sWho = "PostsFilterForm::handleTitleEditSubmit"

        let { onPostEditFinish }  = this.props

	    onPostEditFinish( this.props.posts.post_is_editing_id,  this.state.postIsEditingPost )

        // We should re-filter, including any changes in the filter fields...
        this.filterIt() 
    }

    // Calculate suggestions for any given input value and field key...
    autoSuggestGetSuggestions(value, field){
        let sWho = 'autoSuggestGetSuggestions'
        logajohn.info(`${sWho}: value = `, value )
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        let retourno = null
        if(inputLength === 0){
            retourno = []
        }
        else {
            retourno = this.props.posts.remote_posts_list.filter(post =>
              post[field].toLowerCase().slice(0, inputLength) === inputValue
            ).map(post=>{ return post[field] })

            retourno = retourno.sort() // Should be string sort...
        }
        logajohn.info(`${sWho}: returning `, retourno )
        return retourno
    }

    render() { 
        let sWho = "PostsFilterForm::render"

        let debug = false

        logajohn.debug(`${sWho}(): this.state = `, this.state )

        logajohn.debug(`${sWho}(): this.props = `, this.props )

        let titleFilterAutoSuggestOptions = this.state.titleFilterAutoSuggestArray.map((val,index)=>{
            return <option value={index}>{val}</option>
        })

        return (
        <div>
        <div className="container-fluid">
        <hr/>
        <form className="posts-filter-form form-inline" onSubmit={this.submit}>

         <button id="load-posts" type="submit" className="btn btn-success" aria-label="Load Posts">
            {1==0?<span className="glyphicon glyphicon-refresh" aria-hidden="true" style={{fontWeight: 'bold'}}></span>:""}
            <img src="/postington/images/jeeves-headshot.jpg" style={{height: '40px'}} />
         </button>

         <div className="form-group">
         <label htmlFor="user-id-filter" style={{marginLeft: '4px', marginRight: '2px'}}>User ID Filter:</label>
         <input type="search" className="form-control" size="2" id="user-id-filter" name="userIdFilter" aria-label="User ID Filter" value={this.state.userIdFilter} onChange={this.handleInputChange} />
         </div>


         <div className="form-group">
         <label htmlFor="title-filter" style={{marginLeft: '4px', marginRight: '2px'}}>Title Filter:</label>
         <input type="search" autoComplete="off" className="form-control" id="title-filter" name="titleFilter" aria-label="Title Filter" value={this.state.titleFilter} onChange={this.handleTitleFilterChange} />
         {this.state.titleFilterAutoSuggestArray.length > 0 ? (
          <select size="4" className="form-control" id="title-filter-auto-suggest" name="titleFilterAutoSuggest"
                  aria-label="Title Filter Auto Suggest"
                  value={this.state.titleFilterAutoSuggestIndex}
                  onChange={this.handleTitleFilterAutoSuggestChange}
                  onClick={this.handleTitleFilterAutoSuggestChange}
             >
            {titleFilterAutoSuggestOptions}
          </select>
         )
         :""
         }
         </div>

         <div className="form-group">
            <label htmlFor="full-name-filter" style={{marginLeft: '4px', marginRight: '2px'}}>Body Filter:</label>
            <input type="search" className="form-control" id="body-filter" name="bodyFilter" aria-label="Body Filter" value={this.state.bodyFilter} onChange={this.handleInputChange} />
         </div>


        {1==0 && this.props.posts.post_is_editing ? 
            <div className="panel panel-default" style={
                {width: '70%', marginTop: '1em',
                 //opacity: '1.0',
                 //zOrder: 10,
                 //position: '-webkit-sticky',
                 //position: 'sticky',
                 //position: 'absolute',
                 //top: 0,
                 padding: '5px',
                 backgroundColor: '#cae8ca',
                 border: '2px solid #4CAF50'
                }
            }>
                  <div className="panel-heading">
                    <h3 className="panel-title" style={{textAlign: 'center', fontWeight: 'bold'}}>Edit Post</h3>
                  </div>
                  <div className="panel-body">
                    <form className="post-edit-form form-inline">
         <div className="form-group">
            <label htmlFor="user-id-edit" style={{marginLeft: '4px', marginRight: '2px'}}>User ID:</label>
            <input type="static" style={{backgroundColor: 'inherit'}} className="form-control" id="user-id-edit" name="userIdEdit" aria-label="User ID" value={this.props.posts.post_is_editing_post.userId}/>
         </div>
         <div className="form-group">
            <label htmlFor="title-edit" style={{marginLeft: '4px', marginRight: '2px'}}>Title:</label>
            <input type="text" className="form-control" id="title-edit" name="titleEdit" aria-label="Title Edit"
                               size="40"
                               value={this.state.postIsEditingPost.title}
                               onChange={this.handleTitleEdit} />
         </div>
         <div className="form-group">
            <label htmlFor="body-static" style={{marginLeft: '4px', marginRight: '2px'}}>Body:</label>
            <pre id="body-static" style={{marginLeft: '4px', marginRight: '2px', backgroundColor: 'inherit'}}>
            {this.props.posts.post_is_editing_post.body}
            </pre>
         </div>
                    </form>
                  </div>
                  <div className="panel-footer">
                    <button class="btn btn-success" onClick={this.handleTitleEditSubmit}>OK</button>   <button class="btn btn-default" onClick={this.handleTitleEditCancel}>Cancel</button>
                  </div>
            </div>
         :
           ""
         }

        </form>
        <hr/>
        </div>

        </div>
        )
    }/* render() */

}/* class PostsFilterForm extends Component */ 


PostsFilterForm.propTypes = {
    onPostsFilter: PropTypes.func
}

PostsFilterForm.defaultProps = {
    onPostsFilter: ()=>{}
}

export default withRouter(PostsFilterForm)

