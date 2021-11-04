export default function formatName(name) {
  const processName = name.toLowerCase()
  return processName.charAt(0).toUpperCase() + processName.slice(1)
}
