class ApiFeatures {
  constructor(databaseQuery, requestQueryString) {
    this.databaseQuery = databaseQuery;
    this.requestQueryString = requestQueryString;
  }

  filter() {
    const requestQueryStringObj = { ...this.requestQueryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];

    excludesFields.map((field) => delete requestQueryStringObj[field]);

    let requestQueryStr = JSON.stringify(requestQueryStringObj);

    requestQueryStr = requestQueryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.databaseQuery = this.databaseQuery.find(JSON.parse(requestQueryStr));

    const { page = 1, limit = 40 } = this.requestQueryString;
    const skip = (page - 1) * limit;
    this.databaseQuery = this.databaseQuery.skip(skip).limit(Number(limit));

    const { sort } = this.requestQueryString;
    if (sort) {
      const sortFields = sort.split(",").map((field) => {
        const direction = field.startsWith("-") ? -1 : 1;
        return [field.replace("-", ""), direction];
      });
      this.databaseQuery = this.databaseQuery.sort(
        Object.fromEntries(sortFields)
      );
    }

    return this;
  }

  search(modelName) {
    if (this.requestQueryString.keyword) {
      let query = {};

      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.requestQueryString.keyword, $options: "i" } },
          {
            description: {
              $regex: this.requestQueryString.keyword,
              $options: "i",
            },
          },
        ];
      } else {
        query = {
          name: { $regex: this.requestQueryString.keyword, $options: "i" },
        };
      }

      this.databaseQuery = this.databaseQuery.find(query);
    }

    if (this.requestQueryString.page && this.requestQueryString.limit) {
      const page = parseInt(this.requestQueryString.page, 1) || 1;
      const limit = parseInt(this.requestQueryString.limit, 40) || 10;
      const skip = (page - 1) * limit;

      this.databaseQuery = this.databaseQuery.skip(skip).limit(limit);
    }

    if (
      this.requestQueryString.sortField &&
      this.requestQueryString.sortOrder
    ) {
      const sortField = this.requestQueryString.sortField;
      const sortOrder = this.requestQueryString.sortOrder === "desc" ? -1 : 1;

      this.databaseQuery = this.databaseQuery.sort({ [sortField]: sortOrder });
    }
    return this;
  }

  sort() {
    console.log(this.requestQueryString.fields)
    
    if (this.requestQueryString.fields) {
      const sortBy = this.requestQueryString.fields.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.sort(sortBy);
    } else {
      this.databaseQuery = this.databaseQuery.sort("-createdAt");
    }
    return this;
  }

  fieldsLimit() {
    if (this.requestQueryString.fields) {
      const fields = this.requestQueryString.fields.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.select(fields);
    } else {
      this.databaseQuery = this.databaseQuery.select("-__v");
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.requestQueryString.page * 1 || 1;
    const limit = this.requestQueryString.limit * 1 || 40;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.NumberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.databaseQuery = this.databaseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

module.exports = ApiFeatures