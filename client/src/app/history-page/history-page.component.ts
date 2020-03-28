import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersSevices} from "../shared/services/orders.sevices";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";
const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('tooltip') tooltipRef : ElementRef
  isFilterVisible = false
  tooltip : MaterialInstance
  offset=0
  limit = STEP
  oSub : Subscription
  orders: Order[] = []
  loading  = false
  reloading = true
  noMoreOrders = false
  filter: Filter = {}
  constructor(private ordersSevices : OrdersSevices ) {
  }

  ngOnInit(): void {
    this.fetch()
  }

  private fetch(){
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
   this.oSub = this.ordersSevices.fetch(params).subscribe(orders=>{
      this.orders = this.orders.concat(orders)
     this.noMoreOrders = orders.length < STEP
     this.loading = false
     this.reloading = false
    })
  }

  loadMore(){
    this.offset +=STEP
    this.loading = true
    this.fetch()
  }

  ngOnDestroy(): void {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  applyFilter(filter: Filter){
    this.orders = []
    this.offset = 0
    this.filter = filter

    this.reloading = true
    this.fetch()
  }

  isFiltered() : boolean{
    return Object.keys(this.filter).length!==0
  }
}
