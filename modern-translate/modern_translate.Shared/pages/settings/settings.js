﻿!function(){"use strict";var e=WinJS.Navigation,n=(WinJS.Utilities,WinJS.Binding),t=(WinJS.UI,WinJS.Application,Windows.Storage.ApplicationData.current),i=t.localSettings;WinJS.UI.Pages.define("/pages/settings/settings.html",{ready:function(a,s){Windows.Storage.ApplicationData.current.roamingSettings.values.size>0&&Windows.Storage.ApplicationData.current.roamingSettings.values.clear(),this.bindingData={hideControlStatusbar:!Custom.Device.isPhone,showStatusbar:"undefined"!=typeof i.values.statusbar?i.values.statusbar:!0,useRealtimeTranslation:"undefined"!=typeof i.values["realtime-translation"]?i.values["realtime-translation"]:!0,useBing:"undefined"!=typeof i.values.bing?i.values.bing:!1,useEnterToTranslate:"undefined"!=typeof i.values["enter-to-translate"]?i.values["enter-to-translate"]:!0,usePreventLock:"undefined"!=typeof i.values["prevent-lock"]?i.values["prevent-lock"]:!1,useChineseServer:"undefined"!=typeof i.values["chinese-server"]?i.values["chinese-server"]:!1,useHTTPS:"undefined"!=typeof i.values.https?i.values.https:!1,onclickBack:n.initializer(function(){e.back()}),onclickClearAll:n.initializer(function(){var n=new Windows.UI.Popups.MessageDialog(WinJS.Resources.getString("erase_all_tip").value,WinJS.Resources.getString("erase_all").value);return n.commands.append(new Windows.UI.Popups.UICommand(WinJS.Resources.getString("erase_all_short").value,function(){var n=i.values.purchased;Custom.SQLite.localDatabase.close(),t.clearAsync().then(function(){return Custom.SQLite.setupDatabase()}).then(function(){i.values.purchased=n,Custom.UI.applyTheme(),Custom.UI.applyStatusbar(),e.history.current.initialPlaceholder=!0,e.navigate("/pages/settings/settings.html")})})),n.commands.append(new Windows.UI.Popups.UICommand(WinJS.Resources.getString("cancel").value)),n.defaultCommandIndex=0,n.cancelCommandIndex=1,n.showAsync()}),onclickSignIn:n.initializer(function(){Custom.Sync.signIn()}),toggleStatusbar:n.initializer(function(e){i.values.statusbar=e.srcElement.winControl.checked,Custom.UI.applyStatusbar()}),toggleRealtimeTranslation:n.initializer(function(e){i.values["realtime-translation"]=e.srcElement.winControl.checked}),toggleBing:n.initializer(function(e){i.values.bing=e.srcElement.winControl.checked}),toggleEnterToTranslate:n.initializer(function(e){i.values["enter-to-translate"]=e.srcElement.winControl.checked}),togglePreventLock:n.initializer(function(e){i.values["prevent-lock"]=e.srcElement.winControl.checked}),toggleChineseServer:n.initializer(function(e){i.values["chinese-server"]=e.srcElement.winControl.checked}),toggleHTTPS:n.initializer(function(e){i.values.https=e.srcElement.winControl.checked})},n.processAll(a,this.bindingData)},unload:function(){}})}();