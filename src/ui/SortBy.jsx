import Select from "./Select.jsx";
import {useSearchParams} from "react-router-dom";

export default function SortBy({options}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const sortBy = searchParams.get('sortBy') || ''

    function handleSortChange(e) {
        searchParams.set('sortBy', e.target.value)
        setSearchParams(searchParams)
    }

    return (
        <Select options={options} type={'white'} onChange={handleSortChange} value={sortBy} />
    )
}