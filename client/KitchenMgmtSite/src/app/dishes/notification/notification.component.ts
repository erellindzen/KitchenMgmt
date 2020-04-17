import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit{
  @Input()
  isShow: boolean;

  @Output()
  onClose = new EventEmitter();

  constructor(){}

  ngOnInit() {}

  close() {
    this.onClose.emit();
  }
}