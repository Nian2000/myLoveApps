
# 注意：

manifest.json
====
### APP模块配置
勾选以下两个
* Contact
* Messaging

### APP权限配置
```
勾选以下两个
<uses-permission android:name=\"android.permission.READ_CALL_LOG\"/>
<uses-permission android:name=\"android.permission.WRITE_CALL_LOG\"/>

以下两个默认有勾选 ，如果没默认勾选就勾选上
<uses-permission android:name=\"android.permission.READ_CONTACTS\"/>
<uses-permission android:name=\"android.permission.WRITE_CONTACTS\"/>
```

### 查看效果
```
必须打包 或 会使用自定义基座也行
有些手机需要手动开权限的 可以去手机设置中心应用对其开相应权限 ，获取通话记录call.vue我也处理了权限，为保万一，没效果的时候可以去应用权限看看

```





