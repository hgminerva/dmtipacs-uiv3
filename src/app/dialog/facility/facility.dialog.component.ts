// =======
// Angular
// =======
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// =====
// Wijmo
// =====
import { ObservableArray } from 'wijmo/wijmo';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

// =================
// Service and Model
// =================
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.dialog.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityDialogComponent {
  title = 'facility';

  // ==============================
  // Facility Async Task Properties
  // ==============================
  public facilitySubscription: any;
  public cboFacilityObservableArray: ObservableArray;

  // =====
  // Wijmo
  // =====
  @ViewChild('cboFacility') cboFacility: WjComboBox;

  // ===========
  // Constructor
  // ===========
  constructor(
    public detailFacilityDialogRef: MatDialogRef<FacilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private layoutService: LayoutService
  ) {
    this.title = data.objFacilityTitle;
    
    this.getFacilityData();
  }

  // =================
  // Get Facility Data
  // =================
  public getFacilityData(): void {
    this.layoutService.getFacilities();
    this.facilitySubscription = this.layoutService.facilitiesObservable.subscribe(
      data => {
        let facilityObservableArray = new ObservableArray();

        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; i++) {
            facilityObservableArray.push({
              Id: data[i].Id,
              UserFacility: data[i].UserFacility,
            });
          }
        }

        this.cboFacilityObservableArray = facilityObservableArray;
      }
    );
  }

  // =======================
  // Update Current Facility
  // =======================
  public btnUpdateFacilityClick(): void {
    this.facilitySubscription.unsubscribe();

    localStorage.setItem('current_facility_id', this.cboFacility.selectedValue);
    localStorage.setItem('current_facility', this.cboFacility.selectedItem["UserFacility"]);

    this.detailFacilityDialogRef.close(this.cboFacility.selectedItem["UserFacility"]);
  }

  // ===============
  // On Destory Page
  // ===============
  ngOnDestroy() {
    if (this.facilitySubscription != null) this.facilitySubscription.unsubscribe();
  }
}