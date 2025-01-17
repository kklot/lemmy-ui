import 'moment/locale/es';
import 'moment/locale/el';
import 'moment/locale/eu';
import 'moment/locale/eo';
import 'moment/locale/de';
import 'moment/locale/zh-cn';
import 'moment/locale/fr';
import 'moment/locale/sv';
import 'moment/locale/ru';
import 'moment/locale/nl';
import 'moment/locale/it';
import 'moment/locale/fi';
import 'moment/locale/ca';
import 'moment/locale/fa';
import 'moment/locale/pl';
import 'moment/locale/pt-br';
import 'moment/locale/ja';
import 'moment/locale/ka';
import 'moment/locale/hi';
import 'moment/locale/gl';
import 'moment/locale/tr';
import 'moment/locale/hu';
import 'moment/locale/uk';
import 'moment/locale/sq';
import 'moment/locale/km';
import 'moment/locale/ga';
import 'moment/locale/sr';
import 'moment/locale/ko';
import 'moment/locale/da';

import {
  UserOperation,
  Comment,
  CommentNode as CommentNodeI,
  Post,
  PrivateMessage,
  User,
  SortType,
  ListingType,
  SearchType,
  WebSocketResponse,
  WebSocketJsonResponse,
  SearchForm,
  SearchResponse,
  CommentResponse,
  PostResponse,
} from 'lemmy-js-client';

import { CommentSortType, DataType, IsoData } from './interfaces';
import { UserService, WebSocketService } from './services';

var Tribute;
if (isBrowser()) {
  Tribute = require('tributejs');
}
import markdown_it from 'markdown-it';
import markdown_it_sub from 'markdown-it-sub';
import markdown_it_sup from 'markdown-it-sup';
import markdownitEmoji from 'markdown-it-emoji/light';
import markdown_it_container from 'markdown-it-container';
import emojiShortName from 'emoji-short-name';
import Toastify from 'toastify-js';
import tippy from 'tippy.js';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { retryWhen, delay, take } from 'rxjs/operators';

export const favIconUrl = '/static/assets/favicon.svg';
export const favIconPngUrl = '/static/assets/apple-touch-icon.png';
// TODO
// export const defaultFavIcon = `${window.location.protocol}//${window.location.host}${favIconPngUrl}`;
export const defaultFavIcon = 'test';
export const repoUrl = 'https://github.com/LemmyNet';
export const joinLemmyUrl = 'https://join.lemmy.ml';
export const supportLemmyUrl = 'https://join.lemmy.ml/sponsors';
export const helpGuideUrl = '/docs/about/guide.html';
export const markdownHelpUrl = `${helpGuideUrl}#markdown-guide`;
export const sortingHelpUrl = `${helpGuideUrl}#sorting`;
export const archiveUrl = 'https://archive.is';
export const elementUrl = 'https://element.io/';

export const postRefetchSeconds: number = 60 * 1000;
export const fetchLimit: number = 20;
export const mentionDropdownFetchLimit = 10;

export const languages = [
  { code: 'ca', name: 'Català' },
  { code: 'en', name: 'English' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'eu', name: 'Euskara' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'es', name: 'Español' },
  { code: 'da', name: 'Dansk' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ga', name: 'Gaeilge' },
  { code: 'gl', name: 'Galego' },
  { code: 'hu', name: 'Magyar Nyelv' },
  { code: 'ka', name: 'ქართული ენა' },
  { code: 'ko', name: '한국어' },
  { code: 'km', name: 'ភាសាខ្មែរ' },
  { code: 'hi', name: 'मानक हिन्दी' },
  { code: 'fa', name: 'فارسی' },
  { code: 'ja', name: '日本語' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt_BR', name: 'Português Brasileiro' },
  { code: 'zh', name: '中文' },
  { code: 'fi', name: 'Suomi' },
  { code: 'fr', name: 'Français' },
  { code: 'sv', name: 'Svenska' },
  { code: 'sq', name: 'Shqip' },
  { code: 'sr_Latn', name: 'srpski' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'uk', name: 'Українська Mова' },
  { code: 'ru', name: 'Русский' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'it', name: 'Italiano' },
];

export const themes = [
  'litera',
  'materia',
  'minty',
  'solar',
  'united',
  'cyborg',
  'darkly',
  'journal',
  'sketchy',
  'vaporwave',
  'vaporwave-dark',
  'i386',
  'litely',
];

const DEFAULT_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomCharFromAlphabet(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function randomStr(
  idDesiredLength: number = 20,
  alphabet = DEFAULT_ALPHABET
): string {
  /**
   * Create n-long array and map it to random chars from given alphabet.
   * Then join individual chars as string
   */
  return Array.from({ length: idDesiredLength })
    .map(() => {
      return getRandomCharFromAlphabet(alphabet);
    })
    .join('');
}

export function wsJsonToRes(msg: WebSocketJsonResponse): WebSocketResponse {
  let opStr: string = msg.op;
  return {
    op: UserOperation[opStr],
    data: msg.data,
  };
}

export const md = new markdown_it({
  html: false,
  linkify: true,
  typographer: true,
})
  .use(markdown_it_sub)
  .use(markdown_it_sup)
  .use(markdown_it_container, 'spoiler', {
    validate: function (params: any) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render: function (tokens: any, idx: any) {
      var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<details><summary> ${md.utils.escapeHtml(m[1])} </summary>\n`;
      } else {
        // closing tag
        return '</details>\n';
      }
    },
  })
  .use(markdownitEmoji, {
    defs: objectFlip(emojiShortName),
  });

export function hotRankComment(comment: Comment): number {
  return hotRank(comment.score, comment.published);
}

export function hotRankPost(post: Post): number {
  return hotRank(post.score, post.newest_activity_time);
}

export function hotRank(score: number, timeStr: string): number {
  // Rank = ScaleFactor * sign(Score) * log(1 + abs(Score)) / (Time + 2)^Gravity
  let date: Date = new Date(timeStr + 'Z'); // Add Z to convert from UTC date
  let now: Date = new Date();
  let hoursElapsed: number = (now.getTime() - date.getTime()) / 36e5;

  let rank =
    (10000 * Math.log10(Math.max(1, 3 + score))) /
    Math.pow(hoursElapsed + 2, 1.8);

  // console.log(`Comment: ${comment.content}\nRank: ${rank}\nScore: ${comment.score}\nHours: ${hoursElapsed}`);

  return rank;
}

export function mdToHtml(text: string) {
  return { __html: md.render(text) };
}

export function getUnixTime(text: string): number {
  return text ? new Date(text).getTime() / 1000 : undefined;
}

export function addTypeInfo<T>(
  arr: T[],
  name: string
): { type_: string; data: T }[] {
  return arr.map(e => {
    return { type_: name, data: e };
  });
}

export function canMod(
  user: User,
  modIds: number[],
  creator_id: number,
  onSelf: boolean = false
): boolean {
  // You can do moderator actions only on the mods added after you.
  if (user) {
    let yourIndex = modIds.findIndex(id => id == user.id);
    if (yourIndex == -1) {
      return false;
    } else {
      // onSelf +1 on mod actions not for yourself, IE ban, remove, etc
      modIds = modIds.slice(0, yourIndex + (onSelf ? 0 : 1));
      return !modIds.includes(creator_id);
    }
  } else {
    return false;
  }
}

export function isMod(modIds: number[], creator_id: number): boolean {
  return modIds.includes(creator_id);
}

const imageRegex = new RegExp(
  /(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg|webp))/
);
const videoRegex = new RegExp(`(http)?s?:?(\/\/[^"']*\.(?:mp4))`);

export function isImage(url: string) {
  return imageRegex.test(url);
}

export function isVideo(url: string) {
  return videoRegex.test(url);
}

export function validURL(str: string) {
  return !!new URL(str);
}

export function communityRSSUrl(actorId: string, sort: string): string {
  let url = new URL(actorId);
  return `${url.origin}/feeds${url.pathname}.xml?sort=${sort}`;
}

export function validEmail(email: string) {
  let re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function routeSortTypeToEnum(sort: string): SortType {
  return SortType[sort];
}

export function routeListingTypeToEnum(type: string): ListingType {
  return ListingType[type];
}

export function routeDataTypeToEnum(type: string): DataType {
  return DataType[capitalizeFirstLetter(type)];
}

export function routeSearchTypeToEnum(type: string): SearchType {
  return SearchType[type];
}

export async function getPageTitle(url: string) {
  let res = await fetch(`/iframely/oembed?url=${url}`).then(res => res.json());
  let title = await res.title;
  return title;
}

export function debounce(
  func: any,
  wait: number = 1000,
  immediate: boolean = false
) {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  let timeout: any;

  // Calling debounce returns a new anonymous function
  return function () {
    // reference the context and args for the setTimeout function
    var context = this,
      args = arguments;

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    var callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this
    //   function several times, but it will only execute once
    //   [before or after imposing a delay].
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function () {
      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments
        //    (both captured before setTimeout)
        func.apply(context, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function..
    if (callNow) func.apply(context, args);
  };
}

// TODO
export function getLanguage(override?: string): string {
  let user = UserService.Instance.user;
  let lang = override || (user && user.lang ? user.lang : 'browser');

  if (lang == 'browser' && isBrowser()) {
    return getBrowserLanguage();
  } else {
    return lang;
  }
}

// TODO
export function getBrowserLanguage(): string {
  return navigator.language;
}

export function getMomentLanguage(): string {
  let lang = getLanguage();
  if (lang.startsWith('zh')) {
    lang = 'zh-cn';
  } else if (lang.startsWith('sv')) {
    lang = 'sv';
  } else if (lang.startsWith('fr')) {
    lang = 'fr';
  } else if (lang.startsWith('de')) {
    lang = 'de';
  } else if (lang.startsWith('ru')) {
    lang = 'ru';
  } else if (lang.startsWith('es')) {
    lang = 'es';
  } else if (lang.startsWith('eo')) {
    lang = 'eo';
  } else if (lang.startsWith('nl')) {
    lang = 'nl';
  } else if (lang.startsWith('it')) {
    lang = 'it';
  } else if (lang.startsWith('fi')) {
    lang = 'fi';
  } else if (lang.startsWith('ca')) {
    lang = 'ca';
  } else if (lang.startsWith('fa')) {
    lang = 'fa';
  } else if (lang.startsWith('pl')) {
    lang = 'pl';
  } else if (lang.startsWith('pt')) {
    lang = 'pt-br';
  } else if (lang.startsWith('ja')) {
    lang = 'ja';
  } else if (lang.startsWith('ka')) {
    lang = 'ka';
  } else if (lang.startsWith('hi')) {
    lang = 'hi';
  } else if (lang.startsWith('el')) {
    lang = 'el';
  } else if (lang.startsWith('eu')) {
    lang = 'eu';
  } else if (lang.startsWith('gl')) {
    lang = 'gl';
  } else if (lang.startsWith('tr')) {
    lang = 'tr';
  } else if (lang.startsWith('hu')) {
    lang = 'hu';
  } else if (lang.startsWith('uk')) {
    lang = 'uk';
  } else if (lang.startsWith('sq')) {
    lang = 'sq';
  } else if (lang.startsWith('km')) {
    lang = 'km';
  } else if (lang.startsWith('ga')) {
    lang = 'ga';
  } else if (lang.startsWith('sr')) {
    lang = 'sr';
  } else if (lang.startsWith('ko')) {
    lang = 'ko';
  } else if (lang.startsWith('da')) {
    lang = 'da';
  } else {
    lang = 'en';
  }
  return lang;
}

export function setTheme(theme: string, forceReload: boolean = false) {
  if (!isBrowser()) {
    return;
  }
  if (theme === 'browser' && !forceReload) {
    return;
  }
  // This is only run on a force reload
  if (theme == 'browser') {
    theme = 'darkly';
  }

  // Unload all the other themes
  for (var i = 0; i < themes.length; i++) {
    let styleSheet = document.getElementById(themes[i]);
    if (styleSheet) {
      styleSheet.setAttribute('disabled', 'disabled');
    }
  }

  document
    .getElementById('default-light')
    ?.setAttribute('disabled', 'disabled');
  document.getElementById('default-dark')?.setAttribute('disabled', 'disabled');

  // Load the theme dynamically
  let cssLoc = `/static/assets/css/themes/${theme}.min.css`;
  loadCss(theme, cssLoc);
  document.getElementById(theme).removeAttribute('disabled');
}

export function loadCss(id: string, loc: string) {
  if (!document.getElementById(id)) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = loc;
    link.media = 'all';
    head.appendChild(link);
  }
}

export function objectFlip(obj: any) {
  const ret = {};
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key;
  });
  return ret;
}

export function showAvatars(): boolean {
  return (
    (UserService.Instance.user && UserService.Instance.user.show_avatars) ||
    !UserService.Instance.user
  );
}

export function isCakeDay(published: string): boolean {
  // moment(undefined) or moment.utc(undefined) returns the current date/time
  // moment(null) or moment.utc(null) returns null
  const userCreationDate = moment.utc(published || null).local();
  const currentDate = moment(new Date());

  return (
    userCreationDate.date() === currentDate.date() &&
    userCreationDate.month() === currentDate.month() &&
    userCreationDate.year() !== currentDate.year()
  );
}

export function isCommentType(
  item: Comment | PrivateMessage | Post
): item is Comment {
  return (
    (item as Comment).community_id !== undefined &&
    (item as Comment).content !== undefined
  );
}

export function isPostType(
  item: Comment | PrivateMessage | Post
): item is Post {
  return (item as Post).stickied !== undefined;
}

export function toast(text: string, background: string = 'success') {
  if (isBrowser()) {
    let backgroundColor = `var(--${background})`;
    Toastify({
      text: text,
      backgroundColor: backgroundColor,
      gravity: 'bottom',
      position: 'left',
    }).showToast();
  }
}

export function pictrsDeleteToast(
  clickToDeleteText: string,
  deletePictureText: string,
  deleteUrl: string
) {
  if (isBrowser()) {
    let backgroundColor = `var(--light)`;
    let toast = Toastify({
      text: clickToDeleteText,
      backgroundColor: backgroundColor,
      gravity: 'top',
      position: 'right',
      duration: 10000,
      onClick: () => {
        if (toast) {
          window.location.replace(deleteUrl);
          alert(deletePictureText);
          toast.hideToast();
        }
      },
      close: true,
    }).showToast();
  }
}

interface NotifyInfo {
  name: string;
  icon: string;
  link: string;
  body: string;
}

export function messageToastify(info: NotifyInfo, router: any) {
  if (isBrowser()) {
    let htmlBody = info.body ? md.render(info.body) : '';
    let backgroundColor = `var(--light)`;

    let toast = Toastify({
      text: `${htmlBody}<br />${info.name}`,
      avatar: info.icon,
      backgroundColor: backgroundColor,
      className: 'text-dark',
      close: true,
      gravity: 'top',
      position: 'right',
      duration: 5000,
      onClick: () => {
        if (toast) {
          toast.hideToast();
          router.history.push(info.link);
        }
      },
    }).showToast();
  }
}

export function notifyPost(post: Post, router: any) {
  let info: NotifyInfo = {
    name: post.community_name,
    icon: post.community_icon ? post.community_icon : defaultFavIcon,
    link: `/post/${post.id}`,
    body: post.name,
  };
  notify(info, router);
}

export function notifyComment(comment: Comment, router: any) {
  let info: NotifyInfo = {
    name: comment.creator_name,
    icon: comment.creator_avatar ? comment.creator_avatar : defaultFavIcon,
    link: `/post/${comment.post_id}/comment/${comment.id}`,
    body: comment.content,
  };
  notify(info, router);
}

export function notifyPrivateMessage(pm: PrivateMessage, router: any) {
  let info: NotifyInfo = {
    name: pm.creator_name,
    icon: pm.creator_avatar ? pm.creator_avatar : defaultFavIcon,
    link: `/inbox`,
    body: pm.content,
  };
  notify(info, router);
}

function notify(info: NotifyInfo, router: any) {
  messageToastify(info, router);

  if (Notification.permission !== 'granted') Notification.requestPermission();
  else {
    var notification = new Notification(info.name, {
      icon: info.icon,
      body: info.body,
    });

    notification.onclick = () => {
      event.preventDefault();
      router.history.push(info.link);
    };
  }
}

export function setupTribute() {
  return new Tribute({
    noMatchTemplate: function () {
      return '';
    },
    collection: [
      // Emojis
      {
        trigger: ':',
        menuItemTemplate: (item: any) => {
          let shortName = `:${item.original.key}:`;
          return `${item.original.val} ${shortName}`;
        },
        selectTemplate: (item: any) => {
          return `:${item.original.key}:`;
        },
        values: Object.entries(emojiShortName).map(e => {
          return { key: e[1], val: e[0] };
        }),
        allowSpaces: false,
        autocompleteMode: true,
        // TODO
        // menuItemLimit: mentionDropdownFetchLimit,
        menuShowMinLength: 2,
      },
      // Users
      {
        trigger: '@',
        selectTemplate: (item: any) => {
          let link = item.original.local
            ? `[${item.original.key}](/u/${item.original.name})`
            : `[${item.original.key}](/user/${item.original.id})`;
          return link;
        },
        values: (text: string, cb: any) => {
          userSearch(text, (users: any) => cb(users));
        },
        allowSpaces: false,
        autocompleteMode: true,
        // TODO
        // menuItemLimit: mentionDropdownFetchLimit,
        menuShowMinLength: 2,
      },

      // Communities
      {
        trigger: '!',
        selectTemplate: (item: any) => {
          let link = item.original.local
            ? `[${item.original.key}](/c/${item.original.name})`
            : `[${item.original.key}](/community/${item.original.id})`;
          return link;
        },
        values: (text: string, cb: any) => {
          communitySearch(text, (communities: any) => cb(communities));
        },
        allowSpaces: false,
        autocompleteMode: true,
        // TODO
        // menuItemLimit: mentionDropdownFetchLimit,
        menuShowMinLength: 2,
      },
    ],
  });
}

var tippyInstance;
if (isBrowser()) {
  tippyInstance = tippy('[data-tippy-content]');
}

export function setupTippy() {
  if (isBrowser()) {
    tippyInstance.forEach(e => e.destroy());
    tippyInstance = tippy('[data-tippy-content]', {
      delay: [500, 0],
      // Display on "long press"
      touch: ['hold', 500],
    });
  }
}

function userSearch(text: string, cb: any) {
  if (text) {
    let form: SearchForm = {
      q: text,
      type_: SearchType.Users,
      sort: SortType.TopAll,
      page: 1,
      limit: mentionDropdownFetchLimit,
    };

    WebSocketService.Instance.search(form);

    let userSub = WebSocketService.Instance.subject.subscribe(
      msg => {
        let res = wsJsonToRes(msg);
        if (res.op == UserOperation.Search) {
          let data = res.data as SearchResponse;
          let users = data.users.map(u => {
            return {
              key: `@${u.name}@${hostname(u.actor_id)}`,
              name: u.name,
              local: u.local,
              id: u.id,
            };
          });
          cb(users);
          userSub.unsubscribe();
        }
      },
      err => console.error(err),
      () => console.log('complete')
    );
  } else {
    cb([]);
  }
}

function communitySearch(text: string, cb: any) {
  if (text) {
    let form: SearchForm = {
      q: text,
      type_: SearchType.Communities,
      sort: SortType.TopAll,
      page: 1,
      limit: mentionDropdownFetchLimit,
    };

    WebSocketService.Instance.search(form);

    let communitySub = WebSocketService.Instance.subject.subscribe(
      msg => {
        let res = wsJsonToRes(msg);
        if (res.op == UserOperation.Search) {
          let data = res.data as SearchResponse;
          let communities = data.communities.map(c => {
            return {
              key: `!${c.name}@${hostname(c.actor_id)}`,
              name: c.name,
              local: c.local,
              id: c.id,
            };
          });
          cb(communities);
          communitySub.unsubscribe();
        }
      },
      err => console.error(err),
      () => console.log('complete')
    );
  } else {
    cb([]);
  }
}

export function getListingTypeFromProps(props: any): ListingType {
  return props.match.params.listing_type
    ? routeListingTypeToEnum(props.match.params.listing_type)
    : UserService.Instance.user
    ? Object.values(ListingType)[UserService.Instance.user.default_listing_type]
    : ListingType.Local;
}

// TODO might need to add a user setting for this too
export function getDataTypeFromProps(props: any): DataType {
  return props.match.params.data_type
    ? routeDataTypeToEnum(props.match.params.data_type)
    : DataType.Post;
}

export function getSortTypeFromProps(props: any): SortType {
  return props.match.params.sort
    ? routeSortTypeToEnum(props.match.params.sort)
    : UserService.Instance.user
    ? Object.values(SortType)[UserService.Instance.user.default_sort_type]
    : SortType.Active;
}

export function getPageFromProps(props: any): number {
  return props.match.params.page ? Number(props.match.params.page) : 1;
}

export function getRecipientIdFromProps(props: any): number {
  return props.match.params.recipient_id
    ? Number(props.match.params.recipient_id)
    : 1;
}

export function getIdFromProps(props: any): number {
  return Number(props.match.params.id);
}

export function getCommentIdFromProps(props: any): number {
  return Number(props.match.params.comment_id);
}

export function getUsernameFromProps(props: any): string {
  return props.match.params.username;
}

export function editCommentRes(data: CommentResponse, comments: Comment[]) {
  let found = comments.find(c => c.id == data.comment.id);
  if (found) {
    found.content = data.comment.content;
    found.updated = data.comment.updated;
    found.removed = data.comment.removed;
    found.deleted = data.comment.deleted;
    found.upvotes = data.comment.upvotes;
    found.downvotes = data.comment.downvotes;
    found.score = data.comment.score;
  }
}

export function saveCommentRes(data: CommentResponse, comments: Comment[]) {
  let found = comments.find(c => c.id == data.comment.id);
  if (found) {
    found.saved = data.comment.saved;
  }
}

export function createCommentLikeRes(
  data: CommentResponse,
  comments: Comment[]
) {
  let found: Comment = comments.find(c => c.id === data.comment.id);
  if (found) {
    found.score = data.comment.score;
    found.upvotes = data.comment.upvotes;
    found.downvotes = data.comment.downvotes;
    if (data.comment.my_vote !== null) {
      found.my_vote = data.comment.my_vote;
    }
  }
}

export function createPostLikeFindRes(data: PostResponse, posts: Post[]) {
  let found = posts.find(c => c.id == data.post.id);
  if (found) {
    createPostLikeRes(data, found);
  }
}

export function createPostLikeRes(data: PostResponse, post: Post) {
  if (post) {
    post.score = data.post.score;
    post.upvotes = data.post.upvotes;
    post.downvotes = data.post.downvotes;
    if (data.post.my_vote !== null) {
      post.my_vote = data.post.my_vote;
    }
  }
}

export function editPostFindRes(data: PostResponse, posts: Post[]) {
  let found = posts.find(c => c.id == data.post.id);
  if (found) {
    editPostRes(data, found);
  }
}

export function editPostRes(data: PostResponse, post: Post) {
  if (post) {
    post.url = data.post.url;
    post.name = data.post.name;
    post.nsfw = data.post.nsfw;
    post.deleted = data.post.deleted;
    post.removed = data.post.removed;
    post.stickied = data.post.stickied;
    post.body = data.post.body;
    post.locked = data.post.locked;
    post.saved = data.post.saved;
  }
}

export function commentsToFlatNodes(comments: Comment[]): CommentNodeI[] {
  let nodes: CommentNodeI[] = [];
  for (let comment of comments) {
    nodes.push({ comment: comment });
  }
  return nodes;
}

export function commentSort(tree: CommentNodeI[], sort: CommentSortType) {
  // First, put removed and deleted comments at the bottom, then do your other sorts
  if (sort == CommentSortType.Top) {
    tree.sort(
      (a, b) =>
        +a.comment.removed - +b.comment.removed ||
        +a.comment.deleted - +b.comment.deleted ||
        b.comment.score - a.comment.score
    );
  } else if (sort == CommentSortType.New) {
    tree.sort(
      (a, b) =>
        +a.comment.removed - +b.comment.removed ||
        +a.comment.deleted - +b.comment.deleted ||
        b.comment.published.localeCompare(a.comment.published)
    );
  } else if (sort == CommentSortType.Old) {
    tree.sort(
      (a, b) =>
        +a.comment.removed - +b.comment.removed ||
        +a.comment.deleted - +b.comment.deleted ||
        a.comment.published.localeCompare(b.comment.published)
    );
  } else if (sort == CommentSortType.Hot) {
    tree.sort(
      (a, b) =>
        +a.comment.removed - +b.comment.removed ||
        +a.comment.deleted - +b.comment.deleted ||
        hotRankComment(b.comment) - hotRankComment(a.comment)
    );
  }

  // Go through the children recursively
  for (let node of tree) {
    if (node.children) {
      commentSort(node.children, sort);
    }
  }
}

export function commentSortSortType(tree: CommentNodeI[], sort: SortType) {
  commentSort(tree, convertCommentSortType(sort));
}

function convertCommentSortType(sort: SortType): CommentSortType {
  if (
    sort == SortType.TopAll ||
    sort == SortType.TopDay ||
    sort == SortType.TopWeek ||
    sort == SortType.TopMonth ||
    sort == SortType.TopYear
  ) {
    return CommentSortType.Top;
  } else if (sort == SortType.New) {
    return CommentSortType.New;
  } else if (sort == SortType.Hot || sort == SortType.Active) {
    return CommentSortType.Hot;
  } else {
    return CommentSortType.Hot;
  }
}

export function postSort(
  posts: Post[],
  sort: SortType,
  communityType: boolean
) {
  // First, put removed and deleted comments at the bottom, then do your other sorts
  if (
    sort == SortType.TopAll ||
    sort == SortType.TopDay ||
    sort == SortType.TopWeek ||
    sort == SortType.TopMonth ||
    sort == SortType.TopYear
  ) {
    posts.sort(
      (a, b) =>
        +a.removed - +b.removed ||
        +a.deleted - +b.deleted ||
        (communityType && +b.stickied - +a.stickied) ||
        b.score - a.score
    );
  } else if (sort == SortType.New) {
    posts.sort(
      (a, b) =>
        +a.removed - +b.removed ||
        +a.deleted - +b.deleted ||
        (communityType && +b.stickied - +a.stickied) ||
        b.published.localeCompare(a.published)
    );
  } else if (sort == SortType.Hot) {
    posts.sort(
      (a, b) =>
        +a.removed - +b.removed ||
        +a.deleted - +b.deleted ||
        (communityType && +b.stickied - +a.stickied) ||
        b.hot_rank - a.hot_rank
    );
  } else if (sort == SortType.Active) {
    posts.sort(
      (a, b) =>
        +a.removed - +b.removed ||
        +a.deleted - +b.deleted ||
        (communityType && +b.stickied - +a.stickied) ||
        b.hot_rank_active - a.hot_rank_active
    );
  }
}

export const colorList: string[] = [
  hsl(0),
  hsl(100),
  hsl(150),
  hsl(200),
  hsl(250),
  hsl(300),
];

function hsl(num: number) {
  return `hsla(${num}, 35%, 50%, 1)`;
}

// function randomHsl() {
//   return `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
// }

export function previewLines(
  text: string,
  maxChars: number = 300,
  maxLines: number = 1
): string {
  return (
    text
      .slice(0, maxChars)
      .split('\n')
      // Use lines * 2 because markdown requires 2 lines
      .slice(0, maxLines * 2)
      .join('\n') + '...'
  );
}

export function hostname(url: string): string {
  let cUrl = new URL(url);
  return cUrl.port ? `${cUrl.hostname}:${cUrl.port}` : `${cUrl.hostname}`;
}

export function validTitle(title?: string): boolean {
  // Initial title is null, minimum length is taken care of by textarea's minLength={3}
  if (title === null || title.length < 3) return true;

  const regex = new RegExp(/.*\S.*/, 'g');

  return regex.test(title);
}

export function siteBannerCss(banner: string): string {
  return ` \
    background-image: linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ) ,url("${banner}"); \
    background-attachment: fixed; \
    background-position: top; \
    background-repeat: no-repeat; \
    background-size: 100% cover; \

    width: 100%; \
    max-height: 100vh; \
    `;
}

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function setAuth(obj: any, auth: string) {
  if (auth) {
    obj.auth = auth;
  }
}

export function setIsoData(context: any): IsoData {
  let isoData: IsoData = isBrowser()
    ? window.isoData
    : context.router.staticContext;
  return isoData;
}

export function wsSubscribe(parseMessage: any): Subscription {
  if (isBrowser()) {
    return WebSocketService.Instance.subject
      .pipe(retryWhen(errors => errors.pipe(delay(3000), take(10))))
      .subscribe(
        msg => parseMessage(msg),
        err => console.error(err),
        () => console.log('complete')
      );
  } else {
    return null;
  }
}

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '<1m',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    w: '1w',
    ww: '%dw',
    M: '1M',
    MM: '%dM',
    y: '1Y',
    yy: '%dY',
  },
});
