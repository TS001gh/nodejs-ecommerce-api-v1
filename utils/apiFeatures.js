class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering =>  search by any fields you want to search
    // Fields are we searching like ["ratingsAverage[lte]", "price[gte]", ...]
    const queryStringObj = { ...this.queryString };
    // remove some fields from the query string
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    console.log(queryStringObj);
    // Apply filtration using [gte, gt, lt, lte]
    // coming data from request query { ratingsAverage: { gte: '4' }, price: { gte: '50' } }
    // what we should do for this data { ratingsAverage: { $gte: '4' }, price: { $gte: '50' } }
    let queryStr = JSON.stringify(queryStringObj);

    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortObj = this.queryString.sort.split(",").join(" ");
      console.log(sortObj);
      this.mongooseQuery = this.mongooseQuery.sort(sortObj);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      const { keyword } = this.queryString;
      let query = {};
      if (modelName === "Product") {
        query = {
          $or: [
            { title: { $regex: new RegExp(keyword, "i") } },
            { description: { $regex: new RegExp(keyword, "i") } },
          ],
        };
      } else {
        query = { name: { $regex: new RegExp(keyword, "i") } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // Pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

//   we return the this instance directly because we want to chain one more than methods at same time
//   const apiFeatures = new ApiFeatures();
//   apiFeatures.filter().sort()

export default ApiFeatures;
