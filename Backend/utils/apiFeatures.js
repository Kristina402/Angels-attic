class ApiFeatures {
  // query ==> await Product.find();
  // queryString  ==> req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // specific product search() =>
  search() {
    const keyword = this.queryString.keyword && this.queryString.keyword !== "undefined"
      ? {
          $or: [
            {
              name: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              category: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              brand: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  // filter() the product ==> filetr work base on category
  filter() {
    const queryCopy = { ...this.queryString }; // making the new object of queryString
    //  Removing some fields for category

    const removeFields = ["keyword", "page", "limit", "sort"]; // Add 'sort' to removed fields
    
    removeFields.forEach((key) => delete queryCopy[key]); 

    // Remove empty values from queryCopy
    Object.keys(queryCopy).forEach((key) => {
      if (queryCopy[key] === "" || queryCopy[key] === undefined || queryCopy[key] === "undefined") {
        delete queryCopy[key];
      }
    });

    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy); 
    // regex => \b => start and end value  || for price : gt --> gretaer then || gte --> gretaer then equal to || lt --> less then || lte --> less then equal to , for finding in range of product.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
    const parsedQuery = JSON.parse(queryStr);
    
    // Convert numeric strings to actual numbers for comparison
    const convertToNumbers = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertToNumbers(obj[key]);
        } else if (typeof obj[key] === 'string' && !isNaN(obj[key]) && obj[key].trim() !== '') {
          obj[key] = Number(obj[key]);
        }
      }
    };
    convertToNumbers(parsedQuery);

    this.query = this.query.find(parsedQuery);

    return this;
  }

  // sort() =>
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Pagintaion =>
  
  Pagination(resulltPrrPage) {
  
    // we are shwoing products resulltPrrPage{eg :5 item} in every page
    const currentPage = Number(this.queryString.page) || 1; // if there is no page value in query then show first page
    const skip = resulltPrrPage * (currentPage - 1); // here lets say we have 50 total product and we are showing 10 product  in one page so if page value is 2 then => 10 * (2-1) =  10, we will skip first 10 product for showing second page
    this.query = this.query.limit(resulltPrrPage).skip(skip); // limit is query of mongoose set limit to retrun product and skip is how manny starting product we want to skip for next page number
    return this;
  }
}
module.exports = ApiFeatures;
