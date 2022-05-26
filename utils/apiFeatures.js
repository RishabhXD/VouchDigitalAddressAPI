class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr; //Keyword for search
  }

  search() {
    const name = this.queryStr.name
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: i, //case insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this; //returns same class
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; //page query

    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
  }
}

module.exports = ApiFeatures;
