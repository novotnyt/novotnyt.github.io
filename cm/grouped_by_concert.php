<?php
	// Read CSV file into array
	$rows = array_map('str_getcsv', file('concerts.csv'));

	// Group data by concert date
	$data = array();
	foreach ($rows as $row) {
		$date = $row[0];
		$composer = $row[1];
		$piece = $row[2];
		if (!isset($data[$date])) {
			$data[$date] = array();
		}
		$data[$date][] = array('composer' => $composer, 'piece' => $piece);
	}

	// Generate HTML table for grouped by concert date view
	$html = '<table><tr><th>Concert Date</th><th>Pieces</th></tr>';
	foreach ($data as $date => $pieces) {
		$html .= "<tr><td>$date</td><td>";
		$html .= implode(", ", array_map(function ($p) { return $p['composer'] . ': ' . $p['piece']; }, $pieces));
		$html .= "</td></tr>";
	}
	$html .= '</table>';

	echo $html;
?>
