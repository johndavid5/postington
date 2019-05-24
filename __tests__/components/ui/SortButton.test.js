import SortButton from '../../../src/components/ui/SortButton'

const { mount } = Enzyme

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'
import { customStringify } from '../../../src/lib/utils'

let sWhere = "__tests__/components/ui/SortButton.test.js"

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)


describe("<SortButton /> UI Component", () => {

    let wrapper

    const _onSortBy = jest.fn()

    let props = {sWhat: 'description',
                 sWhatPretty: 'Description',
                 sCurrentSortBy: 'description', 
                 sCurrentAscDesc: 'asc',
                 onSortBy: _onSortBy
                }

    describe("Rendering and clicking", () => {


        beforeAll(() => wrapper = mount(<SortButton {...props} />))

        it(`renders a button with the text '${props.sWhatPretty}'`, () => {
            // SHEMP: Ain't using a button no more, Moe, so dhese expect()'s would fail...
            //expect(wrapper.find("button.btn").length).toEqual(1)
            //expect(wrapper.find("button.btn").text()).toEqual(props.sWhatPretty)
            let id = `#sort-by-${props.sWhat}`
            expect(wrapper.find(id).length).toEqual(1)
            expect(wrapper.find(id).prop('aria-label')).toEqual(`Sort by ${props.sWhatPretty} Descending`)
        })

        it("renders the correct glyph -- with class .glyphicon-chevron-up", () =>
            expect(wrapper.find(".glyphicon-chevron-up").length)
                .toEqual(1))

    })

    describe("Clicking", () => {

        let sWho = `${sWhere}::Clicking...`

        afterEach(() => _onSortBy.mockReset())
        beforeAll(() => wrapper = mount(<SortButton {...props}/>))

        it("Invokes _onSortBy Function", () => {
            // SHEMP: It ain't a button no more, Moe...
            //wrapper.find("button").simulate("click")
            wrapper.simulate("click")
            expect(_onSortBy.mock.calls.length).toEqual(1)
        })

        it("passes the correct arguments to _onSortBy", () => {
            // SHEMP: It ain't a button no more, Moe...
            //wrapper.find("button").simulate("click")
            wrapper.simulate("click")
            //logajohn.debug(`${sWho}: SHEMP: Moe, after clickin' on dha button, _onSortBy.mock.calls = `, customStringify(_onSortBy.mock.calls) )
            //logajohn.debug(`${sWho}: SHEMP: Moe, after clickin' on dha button, _onSortBy.mock.calls[0][0].constructor.name = `, _onSortBy.mock.calls[0][0].constructor.name )
            expect(_onSortBy.mock.calls[0][0].constructor.name).toEqual("SyntheticEvent")
            expect(_onSortBy.mock.calls[0][1]).toEqual("description")
            expect(_onSortBy.mock.calls[0][2]).toEqual("desc")
        })

    })

})
