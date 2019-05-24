set -x
#curl --verbose http://localhost:3005/posts_api/posts?name=fredrica 2>&1 | tee get-posts.out
curl --verbose http://localhost:3005/postington/posts_api/posts?name=fredrica 2>&1 | tee get-posts.out
set +x
