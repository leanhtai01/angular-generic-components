import { Component, OnInit } from '@angular/core';
import { LayerInfo } from './interface/layer-info.interface';
import { ItemFlatNode, ItemNode } from './model/generic-tree-node.model';
import { LayerService } from './service/layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  DATA: LayerInfo = {
    layer1: [
      {
        managerId: 11581385,
        managerName: 'Salvino, Mike Joseph',
        managerEmail: 'mike.salvino@dxc.com',
        orgId: '65000001',
        orgName: 'DXC Technology',
        orgLevel: 'L1',
      },
    ],
    layer2: [
      {
        managerId: 583173,
        managerName: 'Sharp, Ken P',
        managerEmail: 'ken.sharp@dxc.com',
        orgId: '65000026',
        orgName: 'Corp Fn - Finance',
        orgLevel: 'L2',
      },
      {
        managerId: 655831,
        managerName: 'Deckelman Jr., William Leroy',
        managerEmail: 'bill.deckelman@dxc.com',
        orgId: '65000027',
        orgName: 'Corp Fn - Legal',
        orgLevel: 'L2',
      },
    ],
    layer3: [
      {
        managerId: 9015882,
        managerName: 'Copley, Natasha',
        managerEmail: 'ncopley@dxc.com',
        orgId: '65017700',
        orgName: 'Chief of Staff – APAC',
        orgLevel: 'L3',
      },
      {
        managerId: 11571318,
        managerName: 'Owens, Jimmie',
        managerEmail: 'Jimmie.owens@dxc.com',
        orgId: '65000186',
        orgName: 'Global Cyber Security',
        orgLevel: 'L3',
      },
    ],
    layer4: [
      {
        managerId: 11744547,
        managerName: 'Gilmore, Lou Anne',
        managerEmail: 'louanne.gilmore@dxc.com',
        orgId: '65018128',
        orgName: 'Global Delivery Assurance',
        orgLevel: 'L4',
      },
      {
        managerId: 11590932,
        managerName: 'Wentink, Robbert',
        managerEmail: 'robbert.wentink@dxc.com',
        orgId: '65017460',
        orgName: 'Nordics',
        orgLevel: 'L4',
      },
    ],
    layer5: [
      {
        managerId: 20408890,
        managerName: 'Kochan, Kamilia',
        managerEmail: 'kamilia.chouchane@dxc.com',
        orgId: '65018438',
        orgName: 'BPS Poland GD- Operations',
        orgLevel: 'L5',
      },
      {
        managerId: 11735404,
        managerName: 'Pasternak, Sean B.',
        managerEmail: 'sean.pasternak@dxc.com',
        orgId: '65016596',
        orgName: 'External Communications, PR',
        orgLevel: 'L5',
      },
    ],
    layer6: [
      {
        managerId: 11721271,
        managerName: 'Ralph, Glen Dale',
        managerEmail: 'glen.ralph@dxc.com',
        orgId: '65015082',
        orgName: 'Cloud Delivery Advisory',
        orgLevel: 'L6',
      },
      {
        managerId: 11755883,
        managerName: 'Yaman, Mehmet',
        managerEmail: 'mehmet.yaman@dxc.com',
        orgId: '65017872',
        orgName: 'ES CA BC Public Sector - Advanced Solutions',
        orgLevel: 'L6',
      },
    ],
    layer7: [
      {
        managerId: 75006424,
        managerName: 'Ølholm, Arnita',
        managerEmail: 'arnita.oelholm@dxc.com',
        orgId: '65018034',
        orgName: 'Regional Payroll',
        orgLevel: 'L7',
      },
      {
        managerId: 11598689,
        managerName: 'Guevarra, Renalett',
        managerEmail: 'renalett.guevarra@dxc.com',
        orgId: '65015487',
        orgName: 'Cloud Infra / ITO PH - AMS/EU - Batch Shared 2',
        orgLevel: 'L7',
      },
    ],
  };

  title = 'angular-generic-components';

  searchPlaceholder: string = 'Search region or country';

  treeDataSource: ItemNode[] = [];

  constructor(private layerService: LayerService) {}

  ngOnInit(): void {
    this.treeDataSource = this.layerService.buildLayerTree(this.DATA);
  }

  onLayerChanged(selectedItemFlatNodes: ItemFlatNode[]) {
    console.log(selectedItemFlatNodes);
    console.log(this.layerService.toOrgIds(selectedItemFlatNodes));
  }
}
