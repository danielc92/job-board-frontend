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

    interface IApiJob {
      _id: string
      title: string
      slug: string
      creator_id: string
      category: string
      company_name: string
      benefits: string[]
      skills: string[]
      job_summary: string
      contact_summary: string
      company_summary: string
      requirements: string[]
      salary_range_low: number
      salary_range_high: number
      open: boolean
      closes: boolean
      location: {
        type: string
        coordinates: number[]
      }
      location_string: string
      employment_type: string
      createdAt: string
      modifiedAt: string
    }

    interface IExperience {
      start: string
      end: string
      title: string
      details: string
      company: string
      key: string
    }
    
    interface IEducation {
      school: string
      start: string
      end: string
      gpa: number
      course: string
      key: string
    }