import { Table } from "../ui/table"

function TableAndPieChart() {
  return (
    <>
    {/* table */}
    <div className="1xl:w-[718px] 1xl:h-[415px] relative p-4">
        <div className="w-full h-6"></div>
        <div className="absolute top-10 bg-[#F5F5F5] min-w-[718px] h-7"></div>
        <Table>

        </Table>
    </div>
    {/* pie */}
    <div className="1xl:w-[322px] 1xl:h-[415px]">

    </div>
    </>
  )
}

export default TableAndPieChart
