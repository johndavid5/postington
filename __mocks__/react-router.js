const { Component } = React
const { render } = ReactDOM
 

const withRouterMock = ( ComposedComponent ) =>{
  return class withRouterMock extends Component {

            constructor(props) {
                super(props)
            }

            render() {
                return <ComposedComponent
                            {...this.state}
                            {...this.props} />
            }
  }
}

const withRouter = jest.fn()

withRouter.mockImplementation(withRouterMock)

module.exports.withRouter = withRouter
