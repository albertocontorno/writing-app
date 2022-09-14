import { TextEditorBlock } from './models/text-editor.model';
import { Injectable } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Injectable({
  providedIn: 'root',
})
export class TextEditorService {
  editorId: string = '';
  blocks: TextEditorBlock[] = [];
  sel;
  
  constructor(private projectService: ProjectService) {
    
  }

  register(){
    this.projectService.registerEditorService(this.editorId, this);
  }

  onChange(){
    this.projectService.onChange(this.editorId);
  }

  init(blocks: any[]) {
    blocks.forEach((block) => {
      this.blocks.push({
        ...block,
        component: null,
        element: null,
        new: false,
      });
    });

    return this.blocks;
  }

  save(){
    this.projectService.save();
  }

  setCurrentEditor(editor){
    this.projectService.setCurrentEditor(editor);
  }

  onEvent(target: HTMLElement){
    this.projectService.onEvent(target);
  }

  makeBold(block, selection) {
    this.styleRange(selection, 'b');
  }
  makeItalic(block, selection) {
    this.styleRange(selection, 'i');
  }
  highlight(block, selection){
    this.styleRange(selection, 'span', {backgroundColor: 'orange', color: 'black'}, {'te-data': 'te-H'});
  }
  color(block, selection){
    this.styleRange(selection, 'span', {color: 'black'});
  }
  addLink(block, selection){
    // TODO
  }
  addNote(block, selection){
    // TODO
  }
  addReference(block, selection, reference){
    // TODO
    this.styleRange(
      selection,
      'a',
      {color: 'yellow', textDecoration: 'underline'},
      {href: '', 'te-EVENT': '', 'te-data': 'te-REF', 'te-data-context': JSON.stringify({pointer: reference.pointer, id: reference.id}) },
      ['text-editor-reference']
    );
  }

  createReference(block?, selection?){
    this.projectService.createReference();
  }
  useReference(block?, selection?){
    this.sel = selection;
    this.projectService.chooseReference(this);
  }

  getNodesInRange(range) {
    const start = range.startContainer;
    const end = range.endContainer;
    const commonAncestor = range.commonAncestorContainer;
    const nodes: any[] = [];
    let node;

    // walk parent nodes from start to common ancestor
    for (node = start.parentNode; node; node = node.parentNode) {
      if (node.nodeType == 3)
        //modified to only add text nodes to the array
        nodes.push(node);
      if (node == commonAncestor) break;
    }
    nodes.reverse();

    // walk children and siblings from start until end is found
    for (node = start; node; node = this.getNextNode(node)) {
      if (node.nodeType == 3)
        //modified to only add text nodes to the array
        nodes.push(node);
      if (node == end) break;
    }

    return nodes;
  }

  getNextNode(node, end?) {
    if (node.firstChild) return node.firstChild;
    while (node) {
      if (node.nextSibling) return node.nextSibling;
      node = node.parentNode;
    }
  }

  styleRange(range, element, style?, attributes?, classes?: string[], listeners?: {trigger: string, command: (e?: any) => void }[]) {
    if(!range) { return; }
    // the style is the element created to style the text (b, i etc.)
    // Get the start and end nodes and split them to give new start and end nodes with only text that falls inside the range.
    const endOffset = range.endOffset;
    let startNode = range.startContainer.splitText(range.startOffset);
    const endNode = range.endContainer.splitText(
      range.endOffset
    ).previousSibling;
    let oldStartIndex =
      startNode.parentElement.nodeName === element.toUpperCase()
        ? range.startOffset
        : 0;
    let oldEndIndex =
      endNode.parentElement.nodeName === element.toUpperCase()
        ? endOffset
        : endNode.nodeValue.length;
    // Adjust the range to contain the new start and end nodes
    // The offsets are not really important anymore but might as well set them correctly
    range.setStart(startNode, 0);
    range.setEnd(endNode, endNode.length);
    // Get an array of all text nodes within the range
    var nodes = this.getNodesInRange(range);
    let n: any[] = [];
    let newStartNode;
    let newEndNode;
    // Place element tags with style around each textnode
    for (let i = 0; i < nodes.length; i++) {
      let newNode = nodes[i];
      if (nodes[i] === startNode) newStartNode = nodes[i].parentElement;
      if (nodes[i] === endNode) newEndNode = nodes[i].parentElement;
      if (nodes[i].parentElement.nodeName !== element.toUpperCase()) {
        var container = document.createElement(element) as HTMLElement;
        if(classes){
          this.addClasses(container, classes);
        }
        if(style){
          this.addStyle(container, style);
        }
        if(attributes){
          this.addAttributes(container, attributes);
        }
        if(listeners){
          this.addListeners(container, listeners);
        }
        const textNode = document.createTextNode(nodes[i].nodeValue);
        newNode = textNode;
        if (nodes[i] === startNode) newStartNode = container;
        if (nodes[i] === endNode) newEndNode = container;
        container.appendChild(textNode);
        nodes[i].parentNode.replaceChild(container, nodes[i]);
      }
      n.push(newNode);
    }
    if(!(element === 'a' /* || element === 'span' */)){
      this.merge(
        n.length ? n : nodes,
        element,
        range,
        newStartNode,
        oldStartIndex,
        newEndNode,
        oldEndIndex,
        style,
        attributes,
        attributes?.['te-data'],
        classes
      );
    }
    window.getSelection()?.addRange(range);
  }

  merge(
    nodes,
    element,
    range,
    newStartNode,
    oldStartIndex,
    newEndNode,
    oldEndIndex,
    style?,
    attributes?,
    attribute?,
    classes?
  ) {
    const parents: any[] = [];
    let toReplace: any[] = [];
    nodes.forEach((node) => {
      const parent: HTMLElement = node.parentElement.parentElement;
      if (parents.includes(parent)) {
        return;
      }
      parents.push(parent);
      // take all the elements of that type in parent (i.e. all the b or all the span)
      const b: any = parent.querySelectorAll(`${element}${attribute? `[te-data=${attribute}]` : ''}`);
      let prevNode;
      let text = '';
      let currentArr: HTMLElement[] = [];
      b.forEach((el, i) => {
        if (!prevNode) {
          text += this.getAllTextElements(el);
          currentArr = [el];
        } else if (this.isPrevNodeEqual((el.previousSibling?.nodeValue
          ? el.previousSibling
          : el.previousElementSibling), prevNode)
          /* (el.previousSibling?.nodeValue
            ? el.previousSibling
            : el.previousElementSibling) === prevNode */
        ) {
          text += this.getAllTextElements(el);
          currentArr.push(el);
        } else {
          const container = document.createElement(element);
          if(classes){
            this.addClasses(container, classes);
          }
          if(style){
            this.addStyle(container, style);
          }
          if(attributes){
            this.addAttributes(container, attributes);
          }
          container.textContent = text;
          toReplace.push({ delete: currentArr, new: container });
          currentArr = [el];
          text = this.getAllTextElements(el);
        }
        if (i === b.length - 1) {
          const container = document.createElement(element);
          if(classes){
            this.addClasses(container, classes);
          }
          if(style){
            this.addStyle(container, style);
          }
          if(attributes){
            this.addAttributes(container, attributes);
          }
          container.textContent = text;
          toReplace.push({ delete: currentArr, new: container });
        }
        prevNode = el;
      });
    });

    let startIndex = 0;
    let endIndex = 0;
    let r: any = {};
    toReplace.forEach((tr) => {
      startIndex = 0;
      endIndex = 0;
      tr.delete.forEach((element: HTMLElement, i) => {
        if (element === newStartNode) {
          startIndex += oldStartIndex;
          r.startElement = tr.new.firstChild;
          r.startIndex = startIndex;
        } else {
          startIndex += element.textContent?.length || 0;
        }
        if (element === newEndNode) {
          endIndex += oldEndIndex;
          r.endElement = tr.new.firstChild;
          r.endIndex = endIndex;
        } else {
          endIndex += element.textContent?.length || 0;
        }
        if (i === 0) element.replaceWith(tr.new);

        element.remove();
      });
    });
    range.setStart(r.startElement, r.startIndex);
    range.setEnd(r.endElement, r.endIndex);
  }

  isPrevNodeEqual(prev: HTMLElement, curr: HTMLElement): boolean{
    if(prev?.nodeName === 'SPAN' && curr?.nodeName === 'SPAN'){
      return prev.attributes['te-data'] === curr.attributes['te-data']
    }
    return prev === curr;
  }

  addStyle(element: HTMLElement, style: any){
    Object.keys(style)
      .forEach( k => {
        element.style[k] = style[k];
      });
  }
  addAttributes(element: HTMLElement, attributes: any){
    Object.keys(attributes)
      .forEach( k => {
        element.setAttribute(k, attributes[k])
      });
  }
  addClasses(element: HTMLElement, classes: string[]){
    element.classList.add(...classes);
  }
  addListeners(element: HTMLElement, listeners){
    listeners.forEach( listener => {
      element.addEventListener( listener.trigger, listener.command );
    });
  }

  getAllTextElements(n: HTMLElement | ChildNode) {
    let text = '';
    n.childNodes.forEach((el) => {
      if (el.nodeType === 3) {
        text += el.nodeValue;
      } else {
        text += this.getAllTextElements(el);
      }
    });
    return text;
  }

  deleteBlock(selectedBlockIndex){
    this.blocks.splice(selectedBlockIndex, 1);
  }

  addBlock(){}

  replaceBlock(index: number, newBlock){
    this.blocks.splice(index, 1, newBlock);
  }
}
