import PropTypes from 'prop-types';
import { PostsFilterFormContainer, PostsListContainer } from '../containers';

const Posts = () => (
<div className="posts">
        <PostsFilterFormContainer />
        <PostsListContainer />
    </div>
)

Posts.propTypes = {
}

export default Posts
