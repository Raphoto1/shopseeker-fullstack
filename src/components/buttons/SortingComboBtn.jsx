import { useState } from "react";

export default function SortingComboBtn({ setLimitPerPageComp, setSortOptionComp }) {
  const [limitValue, setLimitValue] = useState();
  const [sortValue, setSortValue] = useState();

  const handleLimit = (e) => {
    setLimitValue(e.target.value);
    setLimitPerPageComp(`&limit=${e.target.value}`);
  };
  const handleSort = (e) => {
    setSortValue(e.target.value);
    setSortOptionComp(`&sortQ=${e.target.value}`);
  };
  return (
    <>
      <div className='sort flex justify-center w-30 join'>
        <div id='limitselect' className='join'>
          <select name='limit' id='' className='select-sm join-item' onChange={handleLimit}>
            <option disabled selected>
              {limitValue ? `${limitValue}` : "Designs per Page"}
            </option>
            <option value='20'>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
        </div>
        <div id='sortSelect'>
          <div id='sortOrder' className='join'>
            <select name='sortOrder' id='' className='select-sm join-item' onChange={handleSort}>
              <option disabled selected>
                Designs Order
              </option>
              <option value='1'>A-Z</option>
              <option value='-1'>Z-A</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
