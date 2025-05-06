class MockDataTransfer implements Partial<DataTransfer> {
  dropEffect: DataTransfer['dropEffect'] = 'move';
  effectAllowed: DataTransfer['effectAllowed'] = 'all';
  types: readonly string[] = [];
  items: DataTransferItemList = [] as unknown as DataTransferItemList;
  clearData = jest.fn();
  getData = jest.fn();
  setData = jest.fn();
  setDragImage = jest.fn();
}

Object.defineProperty(window, 'DataTransfer', {
  writable: true,
  configurable: true,
  value: MockDataTransfer,
});
