import { Component, OnInit } from '@angular/core';
import { CarouselControlService } from 'src/app/services/core/carousel-control.service';

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.page.html',
  styleUrls: ['./user-lists.page.scss'],
})
export class UserListsPage implements OnInit {
  constructor(private carouselControl: CarouselControlService) {}

  ngOnInit() {}

  userDummyData: any[] = [
    {
      id: '1',
      img: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg',
      name: 'Jhone Deo',
    },
    {
      id: '2',
      img: 'https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg',
      name: 'Slack Merin',
    },
    {
      id: '3',
      img: 'https://img.freepik.com/free-photo/close-up-portrait-frowning-angry-bearded-man_171337-4829.jpg',
      name:"Rone Modis"
    },
    {
      id: '4',
      img: 'https://img.freepik.com/premium-photo/man-with-beard-smiling-lot_1368-44709.jpg',
      name:"Rahim Gul"
    },
  ];
}
