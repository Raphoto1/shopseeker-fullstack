//imports propios
import { categories, shops } from "@/enums/SuperVariables";

export default function Filters({ setFilterCategoryComp, setFilterShopComp, filterCategory, filterShop }) {
    let filterPathCat = "";
  let filterPathShop = "";

    const handleCategoryFilter = (e) => {
        setFilterCategoryComp(e.target.value);
      };
    
      const handleShopFilter = (e) => {
        setFilterShopComp(e.target.value);
  };
  
  const handleResetFilter = (e) => {
    setFilterCategoryComp('')
    setFilterShopComp('')
  }
  return (
    <>
      <div className='input-group flex justify-center pt-1'>
        <select name='category' id='categoryFilter' className='select-sm justify-center' onChange={handleCategoryFilter}>
          <option disabled selected>
            Filter by Category
          </option>
          {categories.map((cat, index) =>
            filterCategory === cat ? (
              <option selected value={cat} key={index}>
                {cat}
              </option>
            ) : (
              <option value={cat} key={index}>
                {cat}
              </option>
            )
          )}
        </select>
        <select name='shops' id='shopsFilter' className='select-sm' onChange={handleShopFilter}>
          <option disabled selected>
            Filter by Shop
          </option>
          {shops.map((shop, index) =>
            filterShop == shop ? (
              <option selected value={shop} key={index}>
                {shop}
              </option>
            ) : (
              <option value={shop} key={index}>
                {shop}
              </option>
            )
          )}
        </select>
        <button className="btn btn-sm" onClick={handleResetFilter}>Clear Filters</button>
      </div>
    </>
  );
}
