/**
 * BuildingSpec query builder utility
 * Helps construct type-safe, validated query parameters for the BuildingSpec API
 */

export class BuildingSpecQueryBuilder {
  constructor() {
    this.params = {};
  }

  /**
   * Set pagination parameters
   */
  page(pageNum) {
    if (pageNum > 0) this.params.page = pageNum;
    return this;
  }

  limit(limitNum) {
    if (limitNum > 0 && limitNum <= 500) this.params.limit = limitNum;
    return this;
  }

  /**
   * Set year range filters
   */
  yearRange(min, max) {
    if (min) this.params.yearMin = min;
    if (max) this.params.yearMax = max;
    return this;
  }

  yearMin(year) {
    if (year) this.params.yearMin = year;
    return this;
  }

  yearMax(year) {
    if (year) this.params.yearMax = year;
    return this;
  }

  /**
   * Set text filters (case-insensitive regex)
   */
  name(namePattern) {
    if (namePattern) this.params.name = namePattern;
    return this;
  }

  style(stylePattern) {
    if (stylePattern) this.params.style = stylePattern;
    return this;
  }

  architect(architectPattern) {
    if (architectPattern) this.params.architect = architectPattern;
    return this;
  }

  materialType(material) {
    if (material) this.params.materialType = material;
    return this;
  }

  roofType(roofType) {
    if (roofType) this.params.roofType = roofType;
    return this;
  }

  /**
   * Set exact match filters
   */
  status(status) {
    const valid = ['existing', 'demolished', 'under_construction', 'planned'];
    if (status && valid.includes(status)) {
      this.params.status = status;
    }
    return this;
  }

  stories(count) {
    if (count > 0) this.params.stories = count;
    return this;
  }

  /**
   * Set spatial filters
   */
  proximity(lat, lon, radiusMeters) {
    if (lat && lon && radiusMeters) {
      this.params.nearLat = lat;
      this.params.nearLon = lon;
      this.params.radiusMeters = radiusMeters;
    }
    return this;
  }

  bbox(minLon, minLat, maxLon, maxLat) {
    if (minLon != null && minLat != null && maxLon != null && maxLat != null) {
      this.params.bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
    }
    return this;
  }

  /**
   * Set sorting
   * @param {string|string[]} fields - Field name(s), prefix with '-' for descending
   */
  sort(...fields) {
    if (fields.length > 0) {
      this.params.sort = fields.join(',');
    }
    return this;
  }

  /**
   * Set field projection
   * @param {string|string[]} fieldNames - Fields to include in response
   */
  fields(...fieldNames) {
    if (fieldNames.length > 0) {
      this.params.fields = fieldNames.join(',');
    }
    return this;
  }

  /**
   * Get the built query parameters object
   */
  build() {
    return { ...this.params };
  }

  /**
   * Clear all parameters
   */
  reset() {
    this.params = {};
    return this;
  }

  /**
   * Create a URL query string
   */
  toQueryString() {
    const entries = Object.entries(this.params);
    if (entries.length === 0) return '';
    return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  }
}

/**
 * Convenience factory function
 */
export const buildQuery = () => new BuildingSpecQueryBuilder();

/**
 * Example usage:
 * 
 * const query = buildQuery()
 *   .page(1)
 *   .limit(50)
 *   .yearRange(1890, 1920)
 *   .style('Beaux-Arts')
 *   .status('existing')
 *   .sort('-yearCompleted', 'name')
 *   .fields('name', 'yearCompleted', 'architecturalStyle', 'centroid')
 *   .build();
 * 
 * buildingSpecsAPI.getAll(query);
 */

export default BuildingSpecQueryBuilder;
