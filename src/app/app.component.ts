import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

class Permissions {
  constructor(
    public create = new FormControl(false),
    public read = new FormControl(false),
    public update = new FormControl(false),
    public del = new FormControl(false)
  ) {
  }
}

class ObjectPermission {
  constructor(public objectId: number, public permissions: Permissions) {
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'acl-demo';
  objects = [
    {id: 1, name: "Users",},
    {id: 2, name: "Groups",},
    {id: 3, name: "Files",},
  ];
  objectPermissions: ObjectPermission[] = [];
  columnsToDisplay = ["objectId", "name", "create", "read", "update", "delete"];
  createPermissionToAllObjects = new FormControl(false);
  readPermissionToAllObjects = new FormControl(false);
  updatePermissionToAllObjects = new FormControl(false);
  deletePermissionToAllObjects = new FormControl(false);

  /*f1(slavePermission: FormControl, masterPermission: FormControl) {
    return (value: boolean) => {
      if (!value && masterPermission.value == true) {
        masterPermission.setValue(false, {emitEvent: false});
      } else if (value && this.objectPermissions.map(item => item.permissions.create.value).reduce((prev, curr) =>
        prev && curr)) {
        this.createPermissionToAllObjects.setValue(true, {emitEvent: false});
      }
    }
  }*/

  constructor() {
    // Fetch list of objects from server and assign to this.objects
    // Then, create objectPermissions item for each object item
    /*
     * this.http.getObjects().subscribe(data => {
     *   this.objects = data;
     */
    this.objects.forEach(item => {
      const permissions = new Permissions();
      permissions.create.valueChanges.subscribe(value => {
        if (!value && this.createPermissionToAllObjects.value == true) {
          this.createPermissionToAllObjects.setValue(false, {emitEvent: false});
        } else if (value && this.objectPermissions.map(item => item.permissions.create.value).reduce((prev, curr) =>
          prev && curr)) {
          this.createPermissionToAllObjects.setValue(true, {emitEvent: false});
        }
      });
      permissions.read.valueChanges.subscribe(value => {
        if (!value && this.readPermissionToAllObjects.value == true) {
          this.readPermissionToAllObjects.setValue(false, {emitEvent: false});
        } else if (value && this.objectPermissions.map(item => item.permissions.read.value).reduce((prev, curr) =>
          prev && curr)) {
          this.readPermissionToAllObjects.setValue(true, {emitEvent: false});
        }
      });
      permissions.update.valueChanges.subscribe(value => {
        if (!value && this.updatePermissionToAllObjects.value == true) {
          this.updatePermissionToAllObjects.setValue(false, {emitEvent: false});
        } else if (value && this.objectPermissions.map(item => item.permissions.update.value).reduce((prev, curr) =>
          prev && curr)) {
          this.updatePermissionToAllObjects.setValue(true, {emitEvent: false});
        }
      });
      permissions.del.valueChanges.subscribe(value => {
        if (!value && this.deletePermissionToAllObjects.value == true) {
          this.deletePermissionToAllObjects.setValue(false, {emitEvent: false});
        } else if (value && this.objectPermissions.map(item => item.permissions.del.value).reduce((prev, curr) =>
          prev && curr)) {
          this.deletePermissionToAllObjects.setValue(true, {emitEvent: false});
        }
      });
      this.objectPermissions.push(new ObjectPermission(item.id, permissions))
    });
    /*
     * }
     */
    this.createPermissionToAllObjects.valueChanges.subscribe(value => this.setCreatePermissionToAllObjects(value));
    this.createPermissionToAllObjects.registerOnDisabledChange(isDisabled => {
      this.objectPermissions.forEach(item => {
        isDisabled ? item.permissions.create.disable() : item.permissions.create.enable();
      })
    });
    this.readPermissionToAllObjects.valueChanges.subscribe(value => this.setReadPermissionToAllObjects(value));
    this.readPermissionToAllObjects.registerOnDisabledChange(isDisabled => {
      this.objectPermissions.forEach(item => {
        isDisabled ? item.permissions.read.disable() : item.permissions.read.enable();
      })
    });
    this.updatePermissionToAllObjects.valueChanges.subscribe(value => this.setUpdatePermissionToAllObjects(value));
    this.createPermissionToAllObjects.registerOnDisabledChange(isDisabled => {
      this.objectPermissions.forEach(item => {
        isDisabled ? item.permissions.update.disable() : item.permissions.update.enable();
      })
    });
    this.deletePermissionToAllObjects.valueChanges.subscribe(value => this.setDeletePermissionToAllObjects(value));
    this.createPermissionToAllObjects.registerOnDisabledChange(isDisabled => {
      this.objectPermissions.forEach(item => {
        isDisabled ? item.permissions.del.disable() : item.permissions.del.enable();
      })
    });
  }

  getObjectName(objectId: number): string {
    return this.objects.find(item => item.id == objectId)?.name || "";
  }

  setCreatePermissionToAllObjects(value: boolean): void {
    this.objectPermissions.forEach(item => {
      item.permissions.create.setValue(value);
    });
  }

  setReadPermissionToAllObjects(value: boolean): void {
    this.objectPermissions.forEach(item => {
      item.permissions.read.setValue(value);
    });
  }

  setUpdatePermissionToAllObjects(value: boolean): void {
    this.objectPermissions.forEach(item => {
      item.permissions.update.setValue(value);
    });
  }

  setDeletePermissionToAllObjects(value: boolean): void {
    this.objectPermissions.forEach(item => {
      item.permissions.del.setValue(value);
    });
  }

  setReadOnlyAccess(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.readPermissionToAllObjects.setValue(true);
      this.createPermissionToAllObjects.setValue(false);
      this.updatePermissionToAllObjects.setValue(false);
      this.deletePermissionToAllObjects.setValue(false);
      this.createPermissionToAllObjects.disable();
      this.readPermissionToAllObjects.disable();
      this.updatePermissionToAllObjects.disable();
      this.deletePermissionToAllObjects.disable();
    } else {
      this.createPermissionToAllObjects.enable();
      this.readPermissionToAllObjects.enable();
      this.updatePermissionToAllObjects.enable();
      this.deletePermissionToAllObjects.enable();
    }
  }
}
