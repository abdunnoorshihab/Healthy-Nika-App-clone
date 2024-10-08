import { Injectable } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectFade,
  Grid,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';

// install Swiper modules
SwiperCore.use([
  EffectCoverflow,
  EffectFade,
  Autoplay,
  Pagination,
  Navigation,
  Scrollbar,
  Grid,
  EffectCards,
]);

@Injectable({
  providedIn: 'root',
})

export class CarouselControlService {
  constructor() {}
}
