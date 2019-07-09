import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {DocumentVersionService} from "../service/document-version.service";
import {DocumentService} from "../service/document.service";
import {AuthenticationService} from "../service/authentication.service";
import {ActivatedRoute} from "@angular/router";
import * as fileSaver from 'file-saver';
import * as rangy from '@rangy/core';
import * as rangyS from '@rangy/serializer';
import * as rangyH from '@rangy/highlighter';
import * as rangyC from '@rangy/classapplier';
import {Comment} from "../model/comment";
import {CommentService} from "../service/comment.service";

declare var $: any;

@Component({
  selector: 'app-document-version-file',
  templateUrl: './document-version-file.component.html',
  styleUrls: ['./document-version-file.component.scss']
})
export class DocumentVersionFileComponent implements OnInit {

  version: DocumentVersion;
  file: Object;
  fileURL: String;
  comments: Array<Comment>;

  page: number = 1;
  totalPages: number;
  pageRenderes: number = 0;
  isLoaded: boolean = false;
  currentComment: Comment;
  newComment: Comment;
  error = '';

  @ViewChild('pdfViewer') pdfViewer:ElementRef;



  constructor(private documentVersionService: DocumentVersionService,
              private commentService: CommentService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {

        this.route.params.subscribe(params => {
      let documentVersionId = params['id'];
      this.documentVersionService.findById(documentVersionId).subscribe(version => {
        this.version = version;
        this.commentService.findByVersion(version).subscribe(comments => {
          this.comments = comments;
        });
        this.newComment.version = version;
        this.documentVersionService.getFile(version).subscribe(data => {
          this.file = new Blob([data.body], {type: 'application/pdf'});
          this.fileURL = URL.createObjectURL(this.file);
        });
      });
    });

    this.newComment = new Comment();
    this.newComment.owner = this.authenticationService.currentUserValue;

    //fake backend
    //this.fileURL = '/assets/test.pdf';
    //this.comments = [{id:'1', createdDate: new Date(), text: 'My comment', selection: '0/54/1/0/0/0/2/0/0/2/0/0/1/1/2:0,0/54/1/0/0/0/2/0/0/2/0/0/1/1/2:1', toText: 'for this text'}];
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
    console.log('(afterLoadComplete)');
  }

  textLayerRendered(e: CustomEvent) {
    this.pageRenderes++;
    if (this.pageRenderes === this.totalPages) {
      console.log('(text-layer-rendered fertig)');
      this.highlightComments();
    }
  }

  highlightComments() {
    let highlighter = rangyH.createHighlighter();

    let options = {'exclusive': true};
    let pdfViewer = this.pdfViewer.nativeElement;
    let self = this;
    this.comments.forEach(function(comment) {
      let myLocalFunction = function () {
        self.setCurrentComment(comment);
      };
      if (rangyS.canDeserializeSelection(comment.selection, pdfViewer)) {
        rangyS.deserializeSelection(comment.selection, pdfViewer);
        highlighter.addClassApplier(rangyC.createClassApplier("bg-warning", {// bg-warning or  highlight
          ignoreWhiteSpace: true,
          elementProperties: {
            onclick: function () {
              console.log(comment);
              myLocalFunction();
            }
          }
        }));
        highlighter.highlightSelection('bg-warning', options);
      } else {
        console.log('Error: can not deserialize comment #' + comment.id);
      }
    })
  }

  setCurrentComment(comment: Comment) {
    this.currentComment = comment;
  }

  mouseEvent(e: MouseEvent) {
    let rangySelection = rangy.getSelection();
    let text = rangySelection.toString();
    if (text != '') {
      this.newComment.toText = text;
      this.newComment.selection = rangyS.serializeSelection(rangySelection, true, this.pdfViewer.nativeElement);
    }
  }

  //TODO
  addScore() {
    console.log('add score');
  }

  download() {
    fileSaver.saveAs(this.file, this.version.document.name);
  }

  saveComment() {
    console.log('(saveComment)');
    if (this.newComment) {
      this.commentService.save(this.newComment).subscribe(result => console.log('comment saved'));
    } else {
      this.error = 'Please choose text to comment.';
    }
  }

}
