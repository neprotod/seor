<div class="image_menu folder_menu" id="imenu<?php echo $IMENU_ID; ?>" onmouseover="SMImage_ShowImageMenu('imenu<?php echo $IMENU_ID; ?>', 'block');" onmouseout="SMImage_ShowImageMenu('imenu<?php echo $IMENU_ID; ?>', 'none');">
    <ul>
        <li><a href="javascript:;" onclick="SMImage_RenameFolder('<?php echo bin2hex(RC4("id=1&".$GET)); ?>', '<?php echo $FOLDERS[$j]; ?>');"><img style="vertical-align:text-bottom; margin-top:3px; margin-right:6px;" src="img/icon_rename_16x16.png" border="0"><script language="javascript" type="text/javascript">document.write(tinyMCEPopup.getLang('smimage.image_menu_caption_2', '?'));</script></a></li>
        <li><a href="javascript:;" onclick="SMImage_DeleteFolder('<?php echo bin2hex(RC4("id=1&".$GET)); ?>', '<?php echo $FOLDERS[$j]; ?>');"><img style="vertical-align:text-bottom; margin-top:3px; margin-right:6px;" src="img/icon_delete_16x16.png" border="0"><script language="javascript" type="text/javascript">document.write(tinyMCEPopup.getLang('smimage.image_menu_caption_1', '?'));</script></a></li>
    </ul>
</div>