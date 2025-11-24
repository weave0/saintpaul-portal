# Historical Data Processing Script for Saint Paul, MN
# This script helps process Sanborn Maps, GIS data, and historical records
# into the JSON format used by the 3D Historical Viewer

import json
import os
from datetime import datetime

class HistoricalDataProcessor:
    """
    Process historical data from various sources into standardized format.
    
    Supports:
    - Sanborn Fire Insurance Maps (digitized)
    - Ramsey County GIS data
    - Historical aerial photographs
    - Architectural records
    """
    
    def __init__(self, output_dir='../data'):
        self.output_dir = output_dir
        self.snapshots = []
        
    def create_snapshot(self, year, era, description, population):
        """Create a new historical snapshot."""
        snapshot = {
            "year": year,
            "era": era,
            "description": description,
            "population": population,
            "buildings": [],
            "streets": [],
            "dataSources": []
        }
        return snapshot
    
    def add_building_from_sanborn(self, snapshot, sanborn_data):
        """
        Process building data from Sanborn Fire Insurance Maps.
        
        Sanborn maps typically include:
        - Building footprint (dimensions)
        - Construction material
        - Number of stories
        - Roof type
        - Street address
        """
        building = {
            "name": sanborn_data.get('name', 'Unknown Building'),
            "location": {
                "type": "Point",
                "coordinates": sanborn_data['coordinates']  # [lon, lat]
            },
            "built": sanborn_data.get('year_built'),
            "material": sanborn_data.get('material', 'unknown'),
            "materials": sanborn_data.get('materials'),
            "stories": sanborn_data.get('stories', 1),
            "dimensions": {
                "length": sanborn_data.get('length_meters'),
                "width": sanborn_data.get('width_meters'),
                "area_m2": sanborn_data.get('area_m2'),
                "footprintAccuracy_m": sanborn_data.get('footprintAccuracy_m')
            },
            "height": sanborn_data.get('stories', 1) * 4,  # ~4m per story
            "roofType": sanborn_data.get('roof_type', 'flat'),
            "architect": sanborn_data.get('architect'),
            "yearCompleted": sanborn_data.get('year_completed'),
            "status": sanborn_data.get('status', 'completed'),
            "dataSource": {
                "name": "Sanborn Fire Insurance Map",
                "year": sanborn_data.get('sanborn_year'),
                "confidence": sanborn_data.get('confidence', 'high'),
                "rawReference": sanborn_data.get('raw_reference')
            }
        }
        snapshot['buildings'].append(building)
        
    def add_building_from_gis(self, snapshot, gis_data):
        """
        Process building data from modern GIS sources.
        
        GIS data typically includes:
        - Precise coordinates
        - Building footprint polygon
        - Construction year (from tax records)
        - Current use
        """
        building = {
            "name": gis_data.get('name', gis_data.get('address')),
            "location": {
                "type": "Point",
                "coordinates": gis_data['coordinates']
            },
            "built": gis_data.get('year_built'),
            "material": gis_data.get('material', 'unknown'),
            "stories": gis_data.get('stories', 1),
            "dimensions": {
                "length": gis_data.get('length'),
                "width": gis_data.get('width')
            },
            "height": gis_data.get('height', gis_data.get('stories', 1) * 4),
            "roofType": gis_data.get('roof_type', 'flat'),
            "status": "completed",
            "dataSource": {
                "name": gis_data.get('source', 'Ramsey County GIS'),
                "year": datetime.now().year,
                "confidence": "very_high"
            }
        }
        snapshot['buildings'].append(building)
        
    def add_street(self, snapshot, street_data):
        """Add street data to snapshot."""
        street = {
            "name": street_data.get('name'),
            # [[lon1, lat1], [lon2, lat2]]
            "coordinates": street_data.get('coordinates'),
            "width": street_data.get('width_meters', 10),
            "surface": street_data.get('surface', 'dirt'),
            "established": street_data.get('established_year')
        }
        snapshot['streets'].append(street)
        
    def calculate_confidence_score(self, building):
        """
        Calculate confidence score for building accuracy.
        
        Factors:
        - Data source quality
        - Corroboration from multiple sources
        - Precision of measurements
        - Temporal proximity to snapshot year
        """
        source_scores = {
            "Sanborn Fire Insurance Map": 0.9,
            "Ramsey County GIS": 0.95,
            "Historical photograph": 0.7,
            "Architectural drawing": 0.95,
            "Tax assessor record": 0.8,
            "Historical society": 0.75
        }
        
        source = building.get('dataSource', {}).get('name', '')
        return source_scores.get(source, 0.5)
        
    def export_snapshot(self, snapshot, filename=None):
        """Export snapshot to JSON file."""
        if not filename:
            filename = f"snapshot_{snapshot['year']}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(snapshot, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Exported snapshot for {snapshot['year']} to {filepath}")
        print(f"  - {len(snapshot['buildings'])} buildings")
        print(f"  - {len(snapshot['streets'])} streets")
        
    def merge_snapshots(self, output_file='historical-snapshots.json'):
        """Merge all snapshots into a single file."""
        data = {
            "project": "Saint Paul Historical 3D Viewer",
            "created": datetime.now().isoformat(),
            "snapshots": self.snapshots
        }
        
        filepath = os.path.join(self.output_dir, output_file)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Merged {len(self.snapshots)} snapshots to {filepath}")


# Example usage and templates

def example_processing():
    """Example of processing historical data."""
    processor = HistoricalDataProcessor()
    
    # Create a snapshot for 1895 (example)
    snapshot_1895 = processor.create_snapshot(
        year=1895,
        era="Late Victorian Era",
        description="Saint Paul during the height of railroad expansion",
        population=163000
    )
    
    # Example: Add building from Sanborn Map data
    sanborn_capitol = {
        "name": "State Capitol (Under Construction)",
        "coordinates": [-93.1044, 44.9550],
        "year_built": 1895,
        "material": "limestone",
        "stories": 4,
        "length_meters": 110,
        "width_meters": 67,
        "roof_type": "dome",
        "status": "under_construction",
        "sanborn_year": 1895
    }
    processor.add_building_from_sanborn(snapshot_1895, sanborn_capitol)
    
    # Example: Add street
    wabasha_street = {
        "name": "Wabasha Street",
        "coordinates": [[-93.0955, 44.9450], [-93.0955, 44.9550]],
        "width_meters": 12,
        "surface": "cobblestone",
        "established_year": 1849
    }
    processor.add_street(snapshot_1895, wabasha_street)
    
    # Export
    processor.snapshots.append(snapshot_1895)
    processor.export_snapshot(snapshot_1895)
    
    print("\n" + "="*60)
    print("Data Processing Template Created!")
    print("="*60)
    print("\nNext steps:")
    print("1. Obtain digitized Sanborn Maps from Library of Congress")
    print("2. Download GIS data from Ramsey County Open Data Portal")
    print("3. Extract building footprints and metadata")
    print("4. Run this script to process and standardize data")
    print("5. Import into 3D Historical Viewer")


if __name__ == "__main__":
    example_processing()
