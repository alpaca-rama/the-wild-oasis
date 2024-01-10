import TableOperations from "../../ui/TableOperations.jsx";
import Filter from '../../ui/Filter.jsx'
import SortBy from "../../ui/SortBy.jsx";

export default function CabinTableOperations() {
    return (
        <TableOperations>
            <Filter filterField={'discount'} options={[
                {value: 'all', label: 'all'},
                {value: 'no-discount', label: 'No discount'},
                {value: 'with-discount', label: 'With discount'}
            ]} />

            <SortBy options={[
                {value: 'name-asc', label: 'Sort by Name (A-Z)'},
                {value: 'name-desc', label: 'Sort by Name (Z-A)'},
                {value: 'regular_price-asc', label: 'Sort by price (lowest first)'},
                {value: 'regular_price-desc', label: 'Sort by price (highest first)'},
                {value: 'max_capacity-asc', label: 'Sort by capacity (lowest first)'},
                {value: 'max_capacity-desc', label: 'Sort by capacity (highest first)'}
            ]} />
        </TableOperations>
    )
}