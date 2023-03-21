import InternalWsTable from "./Table";
import useTable from "./hooks/useTable";

type InternalWsTableType = typeof InternalWsTable;
type CompoundedComponent = InternalWsTableType & {
    useTable: typeof useTable
};

const WsTable = InternalWsTable as CompoundedComponent;
WsTable.useTable = useTable;
export default WsTable;