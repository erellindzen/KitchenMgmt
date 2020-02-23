import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  private readonly IMAGE_PATH = '../../assets/images/categories/';
  
  private categories = [];
  
  constructor(private kmsService: KmwsService, private router: Router) { }

  ngOnInit() {
    this.kmsService.getCategories()
      .subscribe(
        categories => {
          this.categories = categories.body.map(x => {
            let newCategory = {
              'id': x.id,
              'title': x.title,
              'image': this.IMAGE_PATH + x.image
            };
            return newCategory;
          }),
          err => this.categories = []
      });
  }

  categoryPressed(categoryId){
    this.router.navigate(['/dishes', categoryId]);
  }

}
