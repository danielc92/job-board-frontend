import React, { Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "features/account-auth"
import Footer from "sections/global/Footer"
import Navbar from "sections/global/Navbar"
import Features from "sections/home/Features"
import Banner from "sections/home/Banner"
import { SITE_NAME } from "settings"
import Hero from "sections/home/Hero"
import { featureData } from "./data"

interface IProps {}


const HomePage: React.FC<IProps> = () => {
  return (
    <Fragment>
      <Navbar />

      <Banner
        imageSrc="/images/undraw_interview_rmcf.svg"
        ctaHeader={`Welcome to ${SITE_NAME}`}
        ctaSubHeader="A community driven job board, helping people find the jobs they need."
        buttonText="Explore jobs"
      />
      <Features data={featureData} />
      <Hero
        ctaHeader="Process"
        ctaSubHeader="An easy to use, intuitive process for setting up job postings and applying for jobs."
        image="/images/process_e90d.svg"
        left
      />

      <Hero
        ctaHeader="Personalization"
        ctaSubHeader="Customize your profile, so that employers can find you easily, and you can get the job you want."
        image="/images/success_factors_fay0.svg"
        left={false}
      />

      <Hero
        ctaHeader="Feedback"
        ctaSubHeader="Our system is driven by feedback, ensuring the latest features are what matters to you."
        image="/images/feedback.svg"
        left
      />
      <Footer />
    </Fragment>
  )
}

export default HomePage
