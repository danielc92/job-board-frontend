interface IPayloadLogin {
    email: string
    password: string
  }

  interface IFeatures {
    
      key: string
      icon: any
      title: string
      content: string
    }


    interface IPayloadNewsList extends ParsedUrlQueryInput {
      page: string
    }

    
    interface IPaginatedData<T> {
      results: {
        docs: T[]
        totalDocs: number
        limit: number
        totalPages: number
        page: number
        pagingCounter: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: boolean | null
        nextPage: boolean | null
      }
    }