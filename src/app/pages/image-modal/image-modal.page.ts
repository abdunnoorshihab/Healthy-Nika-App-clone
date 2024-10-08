import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
// import Swiper, {Pagination, SwiperOptions} from "swiper";
import SwiperCore, {Zoom, SwiperOptions, Swiper} from "swiper";
import {SwiperComponent} from "swiper/angular";
import {ModalController} from "@ionic/angular";

SwiperCore.use([Zoom])

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  currentImageIndex = 0;
  currentIndex = 0;
  totalImages: number;
  mainSwiper: Swiper;
  @ViewChild('Swiper') swiper: SwiperComponent
  @Input() images: any;

  constructor(private modalController: ModalController, private ngZone: NgZone) {
  }

  ngOnInit() {
    // console.log("this.images",this.images)
  }


  config: SwiperOptions = {
    zoom: {
      maxRatio: 10,
      minRatio: 0.2
    },
    // pagination: { clickable: true },
    // navigation: true
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  zoom(zoomIn) {
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  close(event) {
    event.stopPropagation();
    this.modalController.dismiss();
  }


  onSlideChange(swiper: Swiper) {
    this.updateIndex(swiper);
  }

  updateIndex(swiper: Swiper) {
    if (swiper && typeof swiper[0]?.activeIndex !== 'undefined') {
      this.ngZone.run(() => {
        this.currentIndex = swiper[0]?.activeIndex;
      });
    }
  }

}
