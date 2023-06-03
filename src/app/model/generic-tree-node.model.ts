/**
 * Node for item
 */
export class ItemNode {
  constructor(
    public item: string,
    public children: ItemNode[],
    public data?: any
  ) {}
}

/**
 * Flat item node with expandable and level information
 */
export class ItemFlatNode {
  constructor(
    public item: string,
    public level: number,
    public expandable: boolean,
    public isVisible: boolean = true,
    public data?: any
  ) {}
}
