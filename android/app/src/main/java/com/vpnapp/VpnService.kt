package com.vpnapp

import android.content.Intent
import android.net.VpnService
import android.util.Log
import com.wireguard.android.backend.GoBackend
import com.wireguard.android.backend.Tunnel
import com.wireguard.config.Config
import java.io.BufferedReader
import java.io.StringReader

class WireGuardVpnService : VpnService() {

    private var backend: GoBackend? = null
    private var activeTunnel: Tunnel? = null

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
                if (config != null) startVpn(config)
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
        Thread {
            try {
                sendStatusBroadcast("connecting")

                if (backend == null) {
                    backend = GoBackend(this)
                }

                val config = Config.parse(BufferedReader(StringReader(configString)))

                val tunnel = object : Tunnel {
                    override fun getName() = "SELFVPN"
                    override fun onStateChange(newState: Tunnel.State) {
                        when (newState) {
                            Tunnel.State.UP -> {
                                isActive = true
                                sendStatusBroadcast("connected")
                                Log.d("WireGuard", "✅ VPN подключён!")
                            }
                            Tunnel.State.DOWN -> {
                                isActive = false
                                sendStatusBroadcast("disconnected")
                                Log.d("WireGuard", "VPN отключён")
                            }
                            else -> {}
                        }
                    }
                }

                activeTunnel = tunnel
                backend!!.setState(tunnel, Tunnel.State.UP, config)

            } catch (e: Exception) {
                Log.e("WireGuard", "❌ Ошибка: ${e.message}")
                isActive = false
                sendStatusBroadcast("error")
            }
        }.start()
    }

    private fun stopVpn() {
        Thread {
            try {
                activeTunnel?.let {
                    backend?.setState(it, Tunnel.State.DOWN, null)
                }
                isActive = false
                sendStatusBroadcast("disconnected")
                stopSelf()
            } catch (e: Exception) {
                Log.e("WireGuard", "Ошибка остановки: ${e.message}")
            }
        }.start()
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