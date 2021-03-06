
const {
  Menu,
  app,
  shell,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const config = require('../config');

const prepareUpdaterForAppImage = require('./prepare-updater-for-appimage');
const sendToAllWindows = require('./send-to-all-windows');
const { getLocale } = require('./locales');
const { getPreference } = require('./preferences');

const createMenu = () => {
  const updaterEnabled = process.env.SNAP == null && !process.mas && !process.windowsStore;

  const template = [
    {
      role: 'edit',
      label: getLocale('edit'),
      submenu: [
        { role: 'undo', label: getLocale('undo') },
        { role: 'redo', label: getLocale('redo') },
        { type: 'separator' },
        { role: 'cut', label: getLocale('cut') },
        { role: 'copy', label: getLocale('copy') },
        { role: 'paste', label: getLocale('paste') },
        { role: 'delete', label: getLocale('delete') },
        { role: 'selectall', label: getLocale('selectAll') },
        { type: 'separator' },
        {
          label: getLocale('find'),
          accelerator: 'CmdOrCtrl+F',
          click: () => sendToAllWindows('open-find'),
        },
        { type: 'separator' },
        {
          label: getLocale('selectInputLang'),
          accelerator: 'CmdOrCtrl+1',
          click: () => sendToAllWindows('go-to-language-list', 'inputLang'),
        },
        {
          label: getLocale('selectOutputLang'),
          accelerator: 'CmdOrCtrl+2',
          click: () => sendToAllWindows('go-to-language-list', 'outputLang'),
        },
        {
          label: getLocale('swapLanguages'),
          accelerator: 'CmdOrCtrl+3',
          click: () => sendToAllWindows('swap-languages'),
        },
        {
          label: getLocale('clearInputText'),
          accelerator: 'CmdOrCtrl+Delete',
          click: () => sendToAllWindows('clear-input-text'),
        },
        {
          label: getLocale('translate'),
          accelerator: 'CmdOrCtrl+T',
          click: () => sendToAllWindows('translate'),
        },
        {
          label: getLocale('translateClipboard'),
          accelerator: 'CmdOrCtrl+Shift+V',
          click: () => sendToAllWindows('translate-clipboard'),
        },
        {
          label: getLocale('addToPhrasebook'),
          accelerator: 'CmdOrCtrl+S',
          click: () => sendToAllWindows('add-to-phrasebook'),
        },
        {
          label: getLocale('removeFromPhrasebook'),
          accelerator: 'CmdOrCtrl+R',
          click: () => sendToAllWindows('remove-from-phrasebook'),
        },
      ],
    },
    {
      role: 'view',
      label: getLocale('view'),
      submenu: [
        {
          label: getLocale('home'),
          accelerator: 'CmdOrCtrl+Shift+H',
          click: () => sendToAllWindows('go-to-home'),
        },
        {
          label: getLocale('phrasebook'),
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => sendToAllWindows('go-to-phrasebook'),
        },
        { type: 'separator' },
        { role: 'togglefullscreen', label: getLocale('toggleFullscreen') },
      ],
    },
    {
      role: 'window',
      label: getLocale('window'),
      submenu: [
        { role: 'minimize', label: getLocale('minimize') },
        { role: 'close', label: getLocale('close') },
      ],
    },
    {
      role: 'help',
      label: getLocale('help'),
      submenu: [
        {
          label: getLocale('translatiumSupport'),
          click: () => shell.openExternal('https://atomery.com/support?app=translatium'),
        },
        {
          label: getLocale('reportAnIssueViaGitHub'),
          click: () => shell.openExternal('https://github.com/translatium/translatium/issues'),
        },
        {
          label: getLocale('learnMore'),
          click: () => shell.openExternal(config.APP_URL),
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    const registered = getPreference('registered');

    template.unshift({
      label: config.APP_NAME,
      submenu: [
        {
          label: getLocale('aboutApp').replace('{appName}', app.name),
          click: () => sendToAllWindows('open-dialog-about'),
        },
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        {
          label: getLocale('checkForUpdates'),
          click: () => {
            global.updateSilent = false;
            autoUpdater.checkForUpdates();
          },
          visible: updaterEnabled,
        },
        {
          type: 'separator',
          visible: process.platform === 'darwin' && !process.mas,
        },
        {
          label: registered ? getLocale('registered') : getLocale('registration'),
          enabled: !registered,
          click: registered ? null : () => sendToAllWindows('open-license-registration-dialog'),
          visible: process.platform === 'darwin' && !process.mas,
        },
        { type: 'separator' },
        {
          label: getLocale('preferencesMenuItem'),
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToAllWindows('go-to-preferences'),
        },
        { type: 'separator' },
        { role: 'hide', label: getLocale('hide') },
        { role: 'hideothers', label: getLocale('hideOthers') },
        { role: 'unhide', label: getLocale('unhide') },
        { type: 'separator' },
        { role: 'quit', label: getLocale('quit') },
      ],
    });

    // Window menu
    template[3].submenu = [
      { role: 'minimize', label: getLocale('minimize') },
      { role: 'zoom', label: getLocale('zoom') },
      { type: 'separator' },
      { role: 'close', label: getLocale('close') },
      { type: 'separator' },
      { role: 'front', label: getLocale('bringAllToFront') },
    ];
  } else {
    // File menu for Windows & Linux
    const submenu = [
      {
        label: getLocale('about'),
        click: () => sendToAllWindows('open-dialog-about'),
      },
      {
        type: 'separator',
      },
      {
        label: getLocale('preferencesMenuItem'),
        accelerator: 'CmdOrCtrl+,',
        click: () => sendToAllWindows('go-to-preferences'),
      },
      { type: 'separator' },
      { role: 'quit', label: getLocale('quit') },
    ];
    if (updaterEnabled) {
      submenu.splice(1, 0, {
        type: 'separator',
      });
      submenu.splice(2, 0, {
        label: getLocale('checkForUpdates'),
        click: () => {
          prepareUpdaterForAppImage(autoUpdater);
          global.updateSilent = false;
          autoUpdater.checkForUpdates();
        },
      });
      submenu.splice(3, 0, {
        type: 'separator',
      });
    }
    template.unshift({
      label: getLocale('file'),
      submenu,
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = createMenu;
