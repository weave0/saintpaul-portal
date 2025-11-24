# Maps Directory

This directory contains map configurations, styles, and resources for the interactive Saint Paul map.

## Mapbox Configuration

The project uses Mapbox GL JS for interactive mapping. Key features include:

- Custom markers for historical locations
- Popup windows with location details
- Category-based styling
- Responsive map controls

## Map Style

The default map style is `mapbox://styles/mapbox/streets-v12`. You can customize this by:

1. Creating a custom style in Mapbox Studio
2. Updating the `mapStyle` prop in `frontend/src/pages/Map.jsx`

## Custom Markers

Location markers are color-coded by category:
- **Landmarks**: Blue (#1a4d7d)
- **Cultural Sites**: Red (#c8102e)
- **Educational**: Light Blue (#4a7ba7)
- **Historical**: Dark Red (#8b0000)
- **Recreational**: Green (#2e8b57)

## Future Enhancements

Potential additions:
- Historical map overlays
- Custom boundary layers for neighborhoods
- Heat maps for event density
- 3D building visualization
- Time-slider for historical progression
- Custom GeoJSON layers

## Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Studio](https://studio.mapbox.com/)
- [GeoJSON Specification](https://geojson.org/)
