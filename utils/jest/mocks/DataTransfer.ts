class MockDataTransfer implements DataTransfer {
  dropEffect: DataTransfer['dropEffect'] = 'move';
  effectAllowed: DataTransfer['effectAllowed'] = 'all';
  types: readonly string[] = [];
  files: FileList = [] as unknown as FileList;
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
