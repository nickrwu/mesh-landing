"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()

    // Camera: face the plane
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, -30, 4)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Plane geometry facing camera
    const size = 200
    const segments = 200
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
    if (geometry.attributes.position instanceof THREE.BufferAttribute) {
      geometry.attributes.position.usage = THREE.DynamicDrawUsage
    }

    const material = new THREE.MeshBasicMaterial({
      color: 0x7c45f5,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Animate vertices on Z-axis for wave
    const animate = () => {
      const grid = meshRef.current
      if (!grid) return

      const time = performance.now() * 0.001
      const posAttr = grid.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array

      for (let i = 2; i < arr.length; i += 3) {
        const x = arr[i - 2]
        const y = arr[i - 1]
        arr[i] =
          Math.sin(x * 0.5 + time) * 0.5 +
          Math.cos(y * 0.5 + time) * 0.5 +
          Math.sin((x + y) * 0.3 + time * 0.7) * 0.3
      }

      posAttr.needsUpdate = true
      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10"
      style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
    />
  )
}