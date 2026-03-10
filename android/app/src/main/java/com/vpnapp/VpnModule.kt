package com.vpnapp

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.VpnService
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class VpnModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var statusReceiver: BroadcastReceiver? = null

    override fun getName() = "VpnModule"

    init {
        registerStatusReceiver()
    }

    private fun registerStatusReceiver() {
    statusReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val status = intent?.getStringExtra("status") ?: return
            sendEvent("vpnStatusChanged", status)
        }
    }
    val filter = IntentFilter("com.vpnapp.VPN_STATUS")
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
        reactContext.registerReceiver(statusReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
    } else {
        reactContext.registerReceiver(statusReceiver, filter)
    }
}

    private fun sendEvent(eventName: String, data: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    @ReactMethod
    fun prepare(promise: Promise) {
        val activity: Activity? = reactContext.currentActivity
        if (activity == null) {
            promise.reject("VPN_ERROR", "Activity is null")
            return
        }
        val intent = VpnService.prepare(reactContext)
        if (intent == null) {
            promise.resolve("granted")
        } else {
            activity.startActivityForResult(intent, VPN_REQUEST_CODE)
            promise.resolve("requested")
        }
    }

    @ReactMethod
    fun connect(config: String, promise: Promise) {
        try {
            val intent = Intent(reactContext, WireGuardVpnService::class.java).apply {
                action = WireGuardVpnService.ACTION_START
                putExtra(WireGuardVpnService.EXTRA_CONFIG, config)
            }
            reactContext.startService(intent)
            promise.resolve("connecting")
        } catch (e: Exception) {
            promise.reject("VPN_ERROR", e.message)
        }
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        try {
            val intent = Intent(reactContext, WireGuardVpnService::class.java).apply {
                action = WireGuardVpnService.ACTION_STOP
            }
            reactContext.startService(intent)
            promise.resolve("disconnecting")
        } catch (e: Exception) {
            promise.reject("VPN_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        promise.resolve(if (WireGuardVpnService.isActive) "connected" else "disconnected")
    }

    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

    override fun onCatalystInstanceDestroy() {
        statusReceiver?.let {
            reactContext.unregisterReceiver(it)
        }
        super.onCatalystInstanceDestroy()
    }

    companion object {
        const val VPN_REQUEST_CODE = 1337
    }
}