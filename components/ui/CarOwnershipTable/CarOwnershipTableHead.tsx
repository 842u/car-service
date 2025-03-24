export function CarOwnershipTableHead() {
  return (
    <thead className="bg-alpha-grey-100">
      <tr className="md:whitespace-nowrap">
        <th className="border-alpha-grey-200 p-2">
          <span className="sr-only">Select</span>
        </th>
        <th className="border-alpha-grey-200 hidden border-r border-l p-2 md:table-cell">
          <span className="sr-only">Owner Avatar</span>
        </th>
        <th className="border-alpha-grey-200 border-r border-l p-2 md:table-cell">
          Username
        </th>
        <th className="border-alpha-grey-200 border-r border-l p-2">
          Owner ID
        </th>
        <th className="border-alpha-grey-200 p-2">Main Owner</th>
      </tr>
    </thead>
  );
}
