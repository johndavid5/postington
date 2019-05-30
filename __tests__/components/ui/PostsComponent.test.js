jest.mock('react-router')
// Otherwise you get Error...
// `Invariant Violation: You should not use <Route> or withRouter() outside a <Router>`

import Posts from '../../../src/components/ui/Posts'
import { PostsFilterFormContainer, PostsListContainer } from '../../../src/components/containers'
jest.mock('../../../src/components/containers') // Create auto-mocks of PostsFilterformContainer, PostsListContainer, ...

const { shallow, mount } = Enzyme

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'
import { utils } from '../../../src/lib/utils'

let sWhere = '__tests__/components/ui/PostsFilterform.test.js' 

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)


describe('<Posts/> UI Component', () => {

    let sWhat = `${sWhere}::<Posts/> UI Component`

    it('<Posts /> component is composed of <PostsFilterFormContainer> and <PostsListContainer>...', ()=>{

        let sWho = `${sWhat}: '<Posts /> component is composed of <PostsFilterFormContainer> and <PostsListContainer>...'`

        let postsWrapper = mount(<Posts />)

        logajohn.debug(`${sWho}: SHEMP: Moe, postsWrapper = `, postsWrapper )
        logajohn.debug(`${sWho}: SHEMP: Moe, postsWrapper.html() = `, postsWrapper.html() )
        logajohn.debug(`${sWho}: SHEMP: Moe, postsWrapper.render() = `, utils.customStringify( postsWrapper.render() ) )

        expect(postsWrapper.find(PostsFilterFormContainer).length).toBe(1)
        expect(postsWrapper.find(PostsListContainer).length).toBe(1)

    })

})
