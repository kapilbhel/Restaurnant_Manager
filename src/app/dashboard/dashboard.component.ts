import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { RestaurnantData } from './restaurnant.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  display = 'none';
  formValue!: FormGroup;
  restaurnantModelObj: RestaurnantData = new RestaurnantData();
  allRestaurnantData: any;
  showAdd!:boolean;
  showbtn!:boolean;
  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.formValue = this.formBuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      service: [''],
    });
    this.getAllData();
  }
  clickAddRestaurnant(){
    this.formValue.reset();
    this.showAdd = true;
    this.showbtn = false;
  }
  openModal() {
    this.display = 'block';
  }
  onCloseHandled() {
    this.display = 'none';
  }
  //add data tom server
  addRestaurnant() {
    this.restaurnantModelObj.name = this.formValue.value.name;
    this.restaurnantModelObj.email = this.formValue.value.email;
    this.restaurnantModelObj.mobile = this.formValue.value.mobile;
    this.restaurnantModelObj.address = this.formValue.value.address;
    this.restaurnantModelObj.service = this.formValue.value.service;
    //subsribe to our data
    this.api.postRestaurnant(this.restaurnantModelObj).subscribe((res) => {
      console.log(res);
      alert('Restaurnant record added sucessfully');
      this.formValue.reset(); //for reseting form value
      this.getAllData(); // for instant addition of data
    });
  }
  //get data from server
  getAllData() {
    this.api.getRestaurnant().subscribe((res) => {
      this.allRestaurnantData = res;
    });
  }
  deleteRestaurnant(data:any){
    this.api.deleteRestaurnant(data.id).subscribe((res)=>{
      alert("Restaurnant deleted successfully")
      this.getAllData(); // quick refresh of data after deletion
    })
  }
  onEditRestaurnant(data:any){
    this.showAdd = false;
    this.showbtn = true;
    this.restaurnantModelObj.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['service'].setValue(data.service);
  }
  updateRestaurnant(){
    this.restaurnantModelObj.name = this.formValue.value.name;
    this.restaurnantModelObj.email = this.formValue.value.email;
    this.restaurnantModelObj.mobile = this.formValue.value.mobile;
    this.restaurnantModelObj.address = this.formValue.value.address;
    this.restaurnantModelObj.service = this.formValue.value.service;
    this.api.updateRestaurnant(this.restaurnantModelObj,this.restaurnantModelObj.id).subscribe(res=>{
    alert("Restaurnant record updated successfully");
    let ref = document.getElementById('clear');
    ref?.click();
    this.formValue.reset();
    this.getAllData();
  })
}
}
