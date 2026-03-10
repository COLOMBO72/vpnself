package com.vpnapp

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import com.wireguard.config.Config
import com.wireguard.config.Interface
import com.wireguard.config.Peer
import com.wireguard.crypto.Key
import java.io.StringReader

class WireGuardVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null
    private var isRunning = false

    companion object {
        const val ACTION_START = "com.vpnapp.START_VPN"
        const val ACTION_STOP = "com.vpnapp.STOP_VPN"
        const val EXTRA_CONFIG = "vpn_config"

        var isActive = false
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return when (intent?.action) {
            ACTION_START -> {
                val config = intent.getStringExtra(EXTRA_CONFIG)
                if (config != null) {
                    startVpn(config)
                }
                START_STICKY
            }
            ACTION_STOP -> {
                stopVpn()
                START_NOT_STICKY
            }
            else -> START_NOT_STICKY
        }
    }

    private fun startVpn(configString: String) {
        try {
            val builder = Builder()
                .setSession("SELFVPN")
                .addAddress("10.0.0.2", 24)
                .addDnsServer("1.1.1.1")
                .addDnsServer("8.8.8.8")
                .addRoute("0.0.0.0", 0)
                .setMtu(1420)

            vpnInterface = builder.establish()
            isRunning = true
            isActive = true

            // Уведомляем React Native
            sendStatusBroadcast("connected")

        } catch (e: Exception) {
            e.printStackTrace()
            sendStatusBroadcast("error")
        }
    }

    private fun stopVpn() {
        try {
            vpnInterface?.close()
            vpnInterface = null
            isRunning = false
            isActive = false
            sendStatusBroadcast("disconnected")
        } catch (e: Exception) {
            e.printStackTrace()
        }
        stopSelf()
    }

    private fun sendStatusBroadcast(status: String) {
        val intent = Intent("com.vpnapp.VPN_STATUS")
        intent.putExtra("status", status)
        sendBroadcast(intent)
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}