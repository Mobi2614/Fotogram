const mongoose = require("mongoose");
function searchQueryConverter(searchData, operator = "$or") {
  let searchFilter;
  try {
    searchFilter = JSON.parse(searchData);
  } catch (error) {
    throw new Error("Invalid Search object");
  }
  let filter = {};
  let filterArray = [];
  for (const key in searchFilter) {
    if (searchFilter.hasOwnProperty(key)) {
      const value = searchFilter[key];
      filterArray.push({
        [key]: { $regex: new RegExp(`.*${value}.*`, "i") },
      });
    }
  }
  filter = { ...filter, [operator]: filterArray };

  return filter;
}

module.exports = {
  searchQueryConverter,
};
