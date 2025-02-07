import React from 'react'
import EmblaCarousel from './EmblaCarousel'
import { EmblaOptionsType } from 'embla-carousel'
// import '../css/base.css'
// import '../css/sandbox.css'
// import '../css/embla.css'

const OPTIONS: EmblaOptionsType = { align: 'start' }
const SLIDE_COUNT = 4


export default function Carousel({slides}: {slides: any}) {
  return (
    <EmblaCarousel slides={slides} options={OPTIONS} />
  )
}